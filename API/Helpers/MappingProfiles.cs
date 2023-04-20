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
        protected MappingProfiles()
        {
            CreateMap<RegisterDto, AppUser>();

            CreateMap<UserDto, AppUser>().ReverseMap();
        }
    }
}