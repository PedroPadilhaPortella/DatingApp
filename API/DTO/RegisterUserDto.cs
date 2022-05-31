using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class RegisterUserDto
    {
        [Required] public string Username { get; set; }

        [Required] public string KnownAs { get; set; }

        [Required] public string Gender { get; set; }

        [Required] public DateTime DateOfBirth { get; set; }

        [Required] public string City { get; set; }

        [Required] public string Country { get; set; }

        [Required]
        [RegularExpression("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$", 
            ErrorMessage = "Your password must contain 8 characters and at least an uppercase letter, a number and a special character ($ * & @ #)")]
        public string Password { get; set; }
    }
}
