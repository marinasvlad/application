using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class SchimbaParolaDTO
    {
        public string Email { get; set; }
        
        public string Token { get; set; }

        public string ParolaNoua { get; set; }
    }
}