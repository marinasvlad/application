using System;
using System.Collections.Generic;
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
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class EleviController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly IPrezenteRepository _prezenteRepo;
        public EleviController(IMapper mapper, UserManager<AppUser> userManager, IPrezenteRepository prezenteRepo)
        {
            _prezenteRepo = prezenteRepo;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetElevi()
        {
            return Ok(await _userManager.Users.ToListAsync());
        }

        [HttpGet("getelevbyid/{elevId}")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<ElevDto>> GetElevById(int elevId)
        {

            var user = await _userManager.FindByIdAsync(elevId.ToString());

            var elevDto = _mapper.Map<ElevDto>(user);
            if (user.LocatieId == 1)
            {
                elevDto.Locatie = "Water Park";
            }
            else if (user.LocatieId == 2)
            {
                elevDto.Locatie = "Imperial Garden";
            }
            else if (user.LocatieId == 3)
            {
                elevDto.Locatie = "Bazinul Carol";
            }

            if (user.NivelId == 1)
            {
                elevDto.Nivel = "Începător";

            }
            else if (user.NivelId == 2)
            {
                elevDto.Nivel = "Intermediar";
            }
            else if (user.NivelId == 3)
            {
                elevDto.Nivel = "Avansat";
            }

            return Ok(elevDto);
        }

        [HttpGet("getprezenteformember")]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<IReadOnlyList<PrezentaDTO>>> GetPrezenteForMember()
        {

            int userId = User.GetUserId();
            var prezente = await _prezenteRepo.GetPrezenteByUserId(userId);
            return Ok(_mapper.Map<IReadOnlyList<PrezentaDTO>>(prezente));
        }

        [HttpGet("getprezentetotielevii")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<IReadOnlyList<PrezentaDTO>>> GetPrezenteTotiElevii()
        {
            var prezente = await _prezenteRepo.GetPrezenteTotiElevii();
            return Ok(_mapper.Map<IReadOnlyList<PrezentaDTO>>(prezente));
        }

        [HttpPost("edituser")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult> EditUser(ElevDto elevDto)
        {
            var user = await _userManager.FindByIdAsync(elevDto.Id.ToString());

            user.NumarSedinte = Convert.ToInt32(elevDto.NumarSedinte);
            user.LocatieId = elevDto.LocatieId;
            user.NivelId = elevDto.NivelId;

            await _userManager.UpdateAsync(user);

            return Ok();
        }
    }
}