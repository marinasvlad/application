using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class RegisterDto
    {
        public string DisplayName { get; set; }   
        public string Email { get; set; }
        //[RegularExpression("(?=^.{6,10}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\\s).*$",ErrorMessage = "Parola trebuie să aibă cel puțin o litera mare, o literă mică, o cifră, un caracter alpha numeric și să aibă cel puțin 6 caractere în total.")]
        public string Password { get; set; }
        public string NumarDeTelefon { get; set; }
        public string Nivel { get; set; }
        public int Varsta { get; set; }
    }
}