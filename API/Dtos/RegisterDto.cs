using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Nu ai completat numele și prenumele")]
        public string DisplayName { get; set; }
        [Required]
        [EmailAddress(ErrorMessage = "Adresa de email este invalidă")]        
        public string Email { get; set; }
        [Required]
        // [RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",ErrorMessage = "Parola trebuie să aibă cel puțin o litera mare, o literă mică, o cifră, un caracter alpha numeric și să aibă cel puțin 6 caractere în total.")]
        public string Password { get; set; }
        [Required]
        public int LocatieNumar { get; set; }
    }
}