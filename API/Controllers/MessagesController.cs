﻿using API.DTO;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private IMessageRepository _messageRepository;
        private readonly IMapper _mapper;

        public MessagesController(IUserRepository userRepository, 
            IMessageRepository messageRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMsg)
        {
            var username = User.GetUsername();

            if (username == createMsg.RecipientUsername.ToLower())
                return BadRequest("you cannot send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var receiper = await _userRepository.GetUserByUsernameAsync          (createMsg.RecipientUsername);

            if (receiper == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = receiper,
                SenderUsername = sender.UserName,
                RecipientUsername = receiper.UserName,
                Content = createMsg.Content,
            };

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) 
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser(
            [FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();

            var messages = await _messageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, 
                messages.PageSize, messages.TotalCount, messages.TotalPages);

            return messages;
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesThread(string username)
        {
            var currentUsername = User.GetUsername();
            return Ok(await _messageRepository.GetMessagesThread(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async  Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await _messageRepository.GetMessage(id);

            if (message.Sender.UserName != username && message.Recipient.UserName != username)
                return Unauthorized();

            if (message.Sender.UserName == username) 
                message.SenderDeleted = true;

            if (message.Recipient.UserName == username)
                message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _messageRepository.DeleteMessage(message);

            if (await _messageRepository.SaveAllAsync())
                return Ok();

            return BadRequest("A problem ocurred while deleting the message");

        }
    }
}
