using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Extensions;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class GrupeController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IGrupeRepository _grupeRepo;
        private readonly ILocatiiRepository _locaiiRepo;
        private readonly IMapper _mapper;
        public GrupeController(UserManager<AppUser> userManager, IGrupeRepository grupeRepo, ILocatiiRepository locaiiRepo, IMapper mapper)
        {
            _mapper = mapper;
            _locaiiRepo = locaiiRepo;
            _grupeRepo = grupeRepo;
            _userManager = userManager;
        }

        [HttpGet("gettoategrupeleactive")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<IReadOnlyList<GrupaDTO>>> GetToateGrupeleActive(){
            var grupe = await _grupeRepo.GetToateGrupeleActive();

            return Ok(_mapper.Map<IReadOnlyList<GrupaDTO>>(grupe));
        }

        [HttpGet("geturmatoareagrupaactiva")]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<GrupaDTO>> GetUrmatoareaGrupaActiva(){
            
            int userId = User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            var grupa = await _grupeRepo.GetUrmatoareaGrupaActivaByLocatieId((int)user.LocatieId);
            var grupaDto = _mapper.Map<GrupaDTO>(grupa);
            if(grupa.Elevi.Contains(user))
            {
                grupaDto.Particip = true;
            }
            else
            {
                grupaDto.Particip = false;
            }
            return Ok(grupaDto);
        }

        [HttpGet("particip/{grupaId}")]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<bool>> Particip(int grupaId){
            
            int userId = User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            var grupa = await _grupeRepo.GetGrupaByIdAsync(grupaId);

            return Ok(await _grupeRepo.AddElevToGrupa(user, grupa));
        }

        [HttpGet("renunt/{grupaId}")]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<bool>> Renunt(int grupaId){
            
            int userId = User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            var grupa = await _grupeRepo.GetGrupaByIdAsync(grupaId);

            return Ok(await _grupeRepo.RenuntElevToGrupa(user, grupa));
        }

        [HttpPost("postgrupa")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<bool>> PostGrupa(GrupaDTO grupaDto){
            
            DateTime dataGrupa = DateTime.ParseExact(grupaDto.DataGrupa, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
            DateTime oraGrupa = DateTime.ParseExact(grupaDto.OraGrupa, "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture);
            var locatie = await _locaiiRepo.GetLocatieByIdAsync(grupaDto.LocatieId);
            Grupa grupa = new Grupa{
                DataGrupa = dataGrupa,
                OraGrupa = oraGrupa,
                LocatieId = locatie.Id,
                Locatie = locatie
            };            

            return Ok(await _grupeRepo.AddNewGrupa(grupa));
        }

        [HttpDelete("deletegrupa/{grupaId}")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<bool>> DeleteGrupa(int grupaId)
        {
            return Ok(await _grupeRepo.DeleteGrupaById(grupaId));
        }
    }
}