using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class InscrieriController : BaseApiController
    {
        private readonly IInscrieriRepository _inscrieriRepo;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILocatiiRepository _locatiiRepo;
        public InscrieriController(IInscrieriRepository inscrieriRepo, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ILocatiiRepository locatiiRepo)
        {
            _locatiiRepo = locatiiRepo;
            _userManager = userManager;
            _signInManager = signInManager;
            _inscrieriRepo = inscrieriRepo;
        }

        [HttpGet]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult<IReadOnlyList<Inscriere>>> GetInscrieri()
        {
            var invoiri = await _inscrieriRepo.GetInscrieriAsync();

            return Ok(invoiri);
        }

        [HttpGet("acceptainscriere/{inscriereId}/{locatieId}")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult> AcceptaInscriere(int inscriereId, int locatieId)
        {


            var inscriere = await _inscrieriRepo.GetInscriereByIdAsync(inscriereId);


            var locatie = await _locatiiRepo.GetLocatieByIdAsync(locatieId);

            int nivelId = 0;

            if (inscriere.Nivel == "incepator")
            {
                nivelId = 1;
            }
            else if (inscriere.Nivel == "mediu")
            {
                nivelId = 2;
            }
            else if (inscriere.Nivel == "avansat")
            {
                nivelId = 3;
            }

            var user = new AppUser
            {
                DisplayName = inscriere.DisplayName,
                Email = inscriere.Email,
                UserName = inscriere.Email,
                LocatieId = locatie.Id,
                NumarSedinte = 10,
                NivelId = nivelId,
                NumarDeTelefon = inscriere.NumarDeTelefon,
                Varsta = inscriere.Varsta
            };

            string password = string.Empty;

            if(inscriere.Password == string.Empty || inscriere.Password == null)
            {
                password = "Pa$$w0rd";
            }
            else
            {
                password = inscriere.Password;
            }

            var results = await _userManager.CreateAsync(user, password);

            if (!results.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }
            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            await _locatiiRepo.AddNewUserToLocatieAsync(user);

            return Ok();      
        }


        [HttpGet("refuzainscriere/{inscriereId}")]
        [Authorize(Policy = "RequireModeratorRole")]
        public async Task<ActionResult> RefuzaInscriere(int inscriereId)
        {
            await _inscrieriRepo.StergeInscriereById(inscriereId);
            return Ok();
        }

    }
}