using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Extensions;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Paging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AnuntController : BaseApiController
    {
        private readonly IAnuntRepository _anuntRepo;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public AnuntController(IAnuntRepository anuntRepo, IMapper mapper, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _anuntRepo = anuntRepo;
        }

        [HttpGet]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<PagedList<AnuntDTO>>> GetAnunturi([FromQuery]UserParams userParams){
            var anunturi = await _anuntRepo.GetAnunturiAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(anunturi.CurrentPage, anunturi.PageSize, anunturi.TotalCount, anunturi.TotalPages));

            return Ok(_mapper.Map<IReadOnlyList<AnuntDTO>>(anunturi));
        }

        // [HttpGet]
        // [Authorize(Policy = "RequireAdminRole")]
        // public async Task<ActionResult<IReadOnlyList<AnuntDTO>>> GetAnunturi(int skip, int take){
        //     var anunturi = await _anuntRepo.GetAnunturiPaginatedAsync(skip, take);
        //     return Ok(_mapper.Map<IReadOnlyList<AnuntDTO>>(anunturi));
        // }        

        [HttpPost]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> PostAnunt(AnuntDTO anuntDto){
            int userId = User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            Anunt anunt = new Anunt{
                Text = anuntDto.Text,
                DataAnunt = DateTime.Now.ToUniversalTime(),
                AppUser = user,
                AppUserId = user.Id
            };

            await _anuntRepo.PostAnunt(anunt);

            return Ok();
        }

        [HttpDelete("{anuntId}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteAnunt(int anuntId){
            await _anuntRepo.DeleteAnunt(anuntId);
            return Ok();
        }        
    }
}