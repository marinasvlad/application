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
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AnuntController : BaseApiController
    {
        private readonly IAnuntRepository _anuntRepo;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILocatiiRepository _locatiiRepo;
        public AnuntController(IAnuntRepository anuntRepo, ILocatiiRepository locatiiRepo, IMapper mapper, UserManager<AppUser> userManager)
        {
            _locatiiRepo = locatiiRepo;
            _userManager = userManager;
            _mapper = mapper;
            _anuntRepo = anuntRepo;
        }

        [HttpGet]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<PagedList<AnuntDTO>>> GetAnunturi([FromQuery]UserParams userParams){
            var user = await _userManager.FindByIdAsync(User.GetUserId().ToString());

            var anunturi = await _anuntRepo.GetAnunturiAsync(userParams, Convert.ToInt32(user.LocatieId));

            Response.AddPaginationHeader(new PaginationHeader(anunturi.CurrentPage, anunturi.PageSize, anunturi.TotalCount, anunturi.TotalPages));

            return Ok(_mapper.Map<IReadOnlyList<AnuntDTO>>(anunturi));
        }

        [HttpGet("getanunturicustom")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<PagedList<AnuntDTO>>> GetAnunturiCustom([FromQuery]UserParams userParams){
            var anunturi = await _anuntRepo.GetAnunturiCustomAsync(userParams);

            Response.AddPaginationHeader(new PaginationHeader(anunturi.CurrentPage, anunturi.PageSize, anunturi.TotalCount, anunturi.TotalPages));

            return Ok(_mapper.Map<IReadOnlyList<AnuntDTO>>(anunturi));
        }        


        [HttpGet("getpagesize")]
        [Authorize(Policy = "RequireMemberRole")]
        public async Task<ActionResult<int>> GetPageSize(){
            var user =  await _userManager.Users.Where(u => u.Id == User.GetUserId()).Include(a => a.Locatie).FirstOrDefaultAsync();

            int pageSize = await _anuntRepo.GetPageSize(user);

            return Ok(pageSize);
        }


        [HttpGet("getpagesizecustom/{locationId}")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<int>> GetPageSizeCustom(int locationId){
            var user = await _userManager.FindByIdAsync(User.GetUserId().ToString());

            if(locationId == 4)
            {                
                return Ok(await _anuntRepo.GetPageSizeToate(user)); 
            }

            if(locationId >= 1 && locationId <= 3)
            {
                return Ok(await _anuntRepo.GetPageSizeByLocatieId(Convert.ToInt32(locationId)));
            }

            int pageSize = await _anuntRepo.GetPageSize(user);
            return Ok(pageSize);
        }        

        [HttpPost]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<IActionResult> PostAnunt(AnuntDTO anuntDto){
            int userId = User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString());

            Anunt anunt = new Anunt{
                Text = anuntDto.Text,
                DataAnunt = DateTime.Now.ToUniversalTime(),
                AppUser = user,
                AppUserId = user.Id,
                LocatieId = anuntDto.LocatieId
            };

            await _anuntRepo.PostAnunt(anunt);

            return Ok();
        }

        [HttpDelete("{anuntId}")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<IActionResult> DeleteAnunt(int anuntId){
            await _anuntRepo.DeleteAnunt(anuntId);
            return Ok();
        }        
    }
}