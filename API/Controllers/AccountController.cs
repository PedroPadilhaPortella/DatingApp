using API.Data;
using API.DTO;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ResponseUserDto>> Register(RegisterUserDto registerUserDto)
        {
            if (await UserExists(registerUserDto.Username)) return BadRequest("Username is taken.");

            var user = _mapper.Map<AppUser>(registerUserDto);

            user.UserName = registerUserDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerUserDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new ResponseUserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<ResponseUserDto>> Login(LoginUserDto loginUserDto)
        {
            var user = await _userManager.Users.Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName == loginUserDto.Username.ToLower());

            if (user == null)  return Unauthorized("Invalid Username");

            var result = await _signInManager
                .CheckPasswordSignInAsync(user, loginUserDto.Password, false);

            if(!result.Succeeded) return Unauthorized();

            return new ResponseUserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string username) 
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}
