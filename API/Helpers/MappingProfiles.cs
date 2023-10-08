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

            CreateMap<AppUser, ElevDto>().ForMember(elevDto => elevDto.Email, user => user.MapFrom(u => u.Email))
                                         .ForMember(elevDto => elevDto.LocatieId, user => user.MapFrom(u => u.LocatieId))
                                         .ForMember(elevDto => elevDto.NivelId, user => user.MapFrom(u => u.NivelId));

            CreateMap<Grupa, GrupaDTO>().ForMember(grupaDto => grupaDto.DataGrupa, grupa => grupa.MapFrom(g => g.DataGrupa.ToString("yyyy-MM-dd HH:mm")))
            .ForMember(grupaDto => grupaDto.OraGrupa, grupa => grupa.MapFrom(g => g.OraGrupa.ToString("yyyy-MM-dd HH:mm")))
            .ForMember(grupaDto => grupaDto.Elevi, grupa => grupa.MapFrom(g => g.Elevi))
            .ForMember(grupaDto => grupaDto.Locatie, grupa => grupa.MapFrom(g => g.Locatie.NumeLocatie))
            .ForMember(grupaDto => grupaDto.NivelId, grupa => grupa.MapFrom(g => g.NivelId));


            CreateMap<Prezenta, PrezentaDTO>().ForMember(prezentaDto => prezentaDto.Data, prezenta => prezenta.MapFrom(p => p.Data.ToString("yyyy-MM-dd HH:mm")))
            .ForMember(prezentaDto => prezentaDto.Start, prezenta => prezenta.MapFrom(p => p.Start.ToString("yyyy-MM-dd HH:mm")))
            .ForMember(prezentaDto => prezentaDto.Stop, prezenta => prezenta.MapFrom(p => p.Stop.ToString("yyyy-MM-dd HH:mm")));

            CreateMap<Inscriere, InscriereDto>().ForMember(insciereDto => insciereDto.DataCerere, inscriere => inscriere.MapFrom(i => i.DataCerere.ToString("yyyy-MM-dd HH:mm")));
        }
    }
}