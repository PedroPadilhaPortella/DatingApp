using API.DTO;
using API.Entities;
using API.Extensions;
using AutoMapper;
using System.Linq;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(member => member.PhotoUrl, user => user
                    .MapFrom(user => user.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(member => member.Age, user => user
                    .MapFrom(x => x.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>();
        }
    }
}
