using API.Data;
using API.Interfaces;
using AutoMapper;
using System.Threading.Tasks;

namespace API.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        public UnitOfWork(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public IUserRepository UserRepository => new UserRepository(context, mapper);

        public IMessageRepository MessageRepository => new MessageRepository(context, mapper);

        public ILikesRepository LikesRepository => new LikesRepository(context, mapper);
        public IPhotoRepository PhotoRepository => new PhotoRepository(context);

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}