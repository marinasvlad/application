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
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetElevi(){
            return Ok(await _userManager.Users.ToListAsync());
        }

        [HttpGet("getprezenteformember")]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<IReadOnlyList<PrezentaDTO>>> GetPrezenteForMember(){

            int userId = User.GetUserId();
            var prezente = await _prezenteRepo.GetPrezenteByUserId(userId);
            return Ok(_mapper.Map<IReadOnlyList<PrezentaDTO>>(prezente));
        }

        [HttpGet("getprezentetotielevii")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<IReadOnlyList<PrezentaDTO>>> GetPrezenteTotiElevii(){
            var prezente = await _prezenteRepo.GetPrezenteTotiElevii();
            return Ok(_mapper.Map<IReadOnlyList<PrezentaDTO>>(prezente));
        }              
    }
}