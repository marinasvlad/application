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

            CreateMap<Grupa, GrupaDTO>().ForMember(grupaDto => grupaDto.DataGrupa, grupa => grupa.MapFrom(g => g.DataGrupa.ToString("yyyy-MM-dd HH:mm")))
            .ForMember(grupaDto => grupaDto.OraGrupa, grupa => grupa.MapFrom(g => g.OraGrupa.ToString("yyyy-MM-dd HH:mm")))
            .ForMember(grupaDto => grupaDto.Elevi, grupa => grupa.MapFrom(g => g.Elevi))
            .ForMember(grupaDto => grupaDto.Locatie, grupa => grupa.MapFrom(g => g.Locatie.NumeLocatie));
        }
    }
}