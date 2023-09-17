using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<RegisterDto, AppUser>();

            CreateMap<UserDto, AppUser>().ReverseMap();

            CreateMap<Anunt, AnuntDTO>().ForMember(anuntDto => anuntDto.Autor, anunt => anunt.MapFrom(a => a.AppUser.DisplayName))
            .ForMember(anuntDto => anuntDto.Data, anunt => anunt.MapFrom(a => a.DataAnunt.ToLocalTime().ToString("dd.MM.yyyy HH:mm")));

            CreateMap<AppUser, ElevDto>();
        }
    }
}