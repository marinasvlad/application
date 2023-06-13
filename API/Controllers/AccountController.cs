using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extensions;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        private readonly IExternalAuthService _externalAuthService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper, IExternalAuthService externalAuthService)
        {
            _externalAuthService = externalAuthService;
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized(new ApiResponse(401));

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }

        [HttpGet("logingoogle")]
        public async Task<ActionResult<UserDto>> LoginGoogle(string code)
        {

            var payload = await _externalAuthService.GetPayloadAsync(code);

            var user = await _userManager.FindByEmailAsync(payload.Email);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };

        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var results = await _userManager.CreateAsync(user, registerDto.Password);

            if (!results.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }
            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Token = await _tokenService.CreateToken(user),
                Email = user.Email
            };
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }
    }
}