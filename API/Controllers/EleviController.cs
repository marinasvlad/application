using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
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
        public EleviController(IMapper mapper, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetElevi(){
            return Ok(await _userManager.Users.ToListAsync());
        }
    }
}