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
using Newtonsoft.Json;
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
        private readonly ILocatiiRepository _locatiiRepo;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService,
         IMapper mapper, IExternalAuthService externalAuthService, ILocatiiRepository locatiiRepo)
        {
            _locatiiRepo = locatiiRepo;
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

        [HttpGet("getgoogleloginurl")]
        public ActionResult<AuthUrlDTO> GetGoogleLoginUrl()
        {
            string url = _externalAuthService.GetGoogleLoginUrl();
            var googleUrlDTO = new AuthUrlDTO{
                Url = url
            };
            return Ok(googleUrlDTO);
        }   

        [HttpGet("getfacebookloginurl")]
        public ActionResult<AuthUrlDTO> GetFacebookLoginUrl()
        {
            string url = _externalAuthService.GetFacebookLoginUrl();
            var facebookUrlDto = new AuthUrlDTO{
                Url = url
            };
            return Ok(facebookUrlDto);
        }           

        [HttpGet("getgoogleregisterurl")]
        public ActionResult<AuthUrlDTO> GetGoogleRegisterUrl()
        {
            string url = _externalAuthService.GetGoogleRegisterUrl();
            var googleUrlDTO = new AuthUrlDTO{
                Url = url
            };
            return Ok(googleUrlDTO);
        }      

        [HttpGet("getfacebookregisterurl")]
        public ActionResult<AuthUrlDTO> GetFacebookRegisterUrl()
        {
            string url = _externalAuthService.GetFacebookRegisterUrl();
            var googleUrlDTO = new AuthUrlDTO{
                Url = url
            };
            return Ok(googleUrlDTO);
        }                

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            if(loginDto.Email == null)
            {
                return BadRequest(new ApiResponse(400, "Nu ai completat adresa de email!"));
            }

            if(loginDto.Password == null)
            {
                return BadRequest(new ApiResponse(400, "Nu ai completat parola!"));
            }
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

        [HttpPost("googlelogin")]
        public async Task<ActionResult<UserDto>> GoogleLogin(AuthCodeDTO googleAuthCodeDTO)
        {

            var payload = await _externalAuthService.GetGooglePayloadAsync(googleAuthCodeDTO.code);

            var user = await _userManager.FindByEmailAsync(payload.Email);

            if(user == null)
            {
                return BadRequest(new ApiResponse(400, "Userul nu a fost gasit"));
            }
            
            return Ok(new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            });
        }

        [HttpPost("facebooklogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(AuthCodeDTO facebookCodeDTO)
        {

            var userObject = await _externalAuthService.GetFacebookPayloadAsync(facebookCodeDTO.code);

            var user = await _userManager.FindByEmailAsync(userObject.Item2);
            if(user == null)
            {
                return BadRequest(new ApiResponse(400, "Userul nu a fost gasit"));
            }
            return Ok(new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            });
        }
        [HttpPost("getgooglepayload")]
        public async Task<ActionResult<string>> GetGooglePayload(AuthCodeDTO googleAuthCodeDTO)
        {

            var payload = await _externalAuthService.GetGooglePayloadAsync(googleAuthCodeDTO.code);

            OauthRegisterDTO googleRegisterDTO = new OauthRegisterDTO();

            googleRegisterDTO.Email = payload.Email;
            googleRegisterDTO.DisplayName = payload.Name;
            googleRegisterDTO.Provider = "Google";

            string googleRegisterJsonString = JsonConvert.SerializeObject(googleRegisterDTO);
            return googleRegisterJsonString;
        }        

        [HttpPost("getfacebookpayload")]
        public async Task<ActionResult<string>> GetFacebookPayload(AuthCodeDTO facebookAuthCodeDTO)
        {

            var payload = await _externalAuthService.GetFacebookPayloadAsync(facebookAuthCodeDTO.code);

            OauthRegisterDTO facebookRegisterDTO = new OauthRegisterDTO();

            facebookRegisterDTO.Email = payload.Item2;
            facebookRegisterDTO.DisplayName = payload.Item1;
            facebookRegisterDTO.Provider = "Facebook";
            string googleRegisterJsonString = JsonConvert.SerializeObject(facebookRegisterDTO);
            return googleRegisterJsonString;
        }        

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return BadRequest(new ApiResponse(400, "Adresa de email este deja folosită de alt cont."));

            }

            var contNume = await _userManager.Users.FirstOrDefaultAsync(cont => cont.DisplayName == registerDto.DisplayName);
            if(contNume != null)
            {
                //return BadRequest(new ApiValidationErrorResponse { Errors = new[] { "Numele și prenumele mai sunt folosite deja de un alt cont. Poți adăuga un număr la final pentru a evita coincidența." } });
                return BadRequest(new ApiResponse(400, "Numele și prenumele mai sunt folosite deja de un alt cont. Poți adăuga un număr la final pentru a evita coincidența."));

            }

            if(registerDto.Password == string.Empty || registerDto.Password == null)
            {
                return BadRequest(new ApiResponse(400, "Nu ai completat parola." ));
            }

            if(registerDto.LocatieNumar == 0)
            {
                return BadRequest(new ApiResponse(400, "Nu ai selectat locatia." ));
            }
            var locatie = await _locatiiRepo.GetLocatieByIdAsync(registerDto.LocatieNumar);

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                Locatie = locatie,
                LocatieId = locatie.Id,
                NumarSedinte = 8
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

            await _locatiiRepo.AddNewUserToLocatieAsync(user);

            return Ok(new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            });
        }


        [HttpPost("oauthregister")]
        public async Task<ActionResult> GoogleRegister(OauthRegisterDTO registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return BadRequest(new ApiResponse(400, "Adresa de email este deja folosită de alt cont." ));
            }

            var contNume = await _userManager.Users.FirstOrDefaultAsync(cont => cont.DisplayName == registerDto.DisplayName);
            if(contNume != null)
            {
                return BadRequest(new ApiResponse(400, "Numele și prenumele mai sunt folosite deja de un alt cont. Poți adăuga un număr la final pentru a evita coincidența." ));
            }

            if(registerDto.LocatieNumar == 0)
            {
                return BadRequest(new ApiResponse(400, "Nu ai selectat locatia." ));
            }
            var locatie = await _locatiiRepo.GetLocatieByIdAsync(registerDto.LocatieNumar);

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
                Locatie = locatie,
                LocatieId = locatie.Id,
                NumarSedinte = 8
            };

            var results = await _userManager.CreateAsync(user, "Pa$$w0rd");

            if (!results.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }
            var roleResult = await _userManager.AddToRolesAsync(user,new[] {"Admin","Moderator","Member"});

            if (!roleResult.Succeeded)
            {
                return BadRequest(new ApiResponse(400));
            }

            await _locatiiRepo.AddNewUserToLocatieAsync(user);

            return Ok(new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            });        
        }        

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }
    }
}