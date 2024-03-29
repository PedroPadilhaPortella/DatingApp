﻿using API.DTO;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class MessageHub: Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;

        public MessageHub(
            IUnitOfWork unitOfWork,
            IMapper mapper, 
            IHubContext<PresenceHub> presenceHub,
            PresenceTracker presenceTracker)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _presenceTracker = presenceTracker;
        }


        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            string username = Context.User.GetUsername();
            string otherUser = httpContext.Request.Query["user"].ToString();
            string groupName = this.GetGroupName(username, otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            Group group = await AddToGroup(groupName);

            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _unitOfWork.MessageRepository.GetMessagesThread(username, otherUser);

            if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }


        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Group group = await RemoveFromMessageGroup();

            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);

            await base.OnDisconnectedAsync(exception);
        }


        public async Task SendMessage(CreateMessageDto createMsg)
        {
            var username = Context.User.GetUsername();
            var recipientUsername = createMsg.RecipientUsername.ToLower();

            if (username == createMsg.RecipientUsername.ToLower())
                throw new HubException("you cannot send messages to yourself");

            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            var recipient = await _unitOfWork.UserRepository.GetUserByUsernameAsync(recipientUsername);

            if (recipient == null) throw new HubException("not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMsg.Content,
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);

            if(group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            } 
            else
            {
                var connections = await _presenceTracker.GetConnectionsForUser(recipient.UserName);

                if(connections != null)
                {
                    await _presenceHub.Clients.Clients(connections)
                        .SendAsync("NewMessageReceived",
                        new { username = sender.UserName, knownAs = sender.KnownAs });
                }
            }

            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete())
            {
                await Clients.Group(groupName)
                    .SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }
        }


        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare? $"{caller}-{other}" : $"{other}-{caller}";
        }


        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            if(group == null)
            {
                group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if(await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to join group");
        }


        private async Task<Group> RemoveFromMessageGroup()
        {
            Group group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.MessageRepository.RemoveConnection(connection);

            if (await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to remove from group");
        }
    }
}
