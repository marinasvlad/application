using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class ChangeParolaDTO
    {
        public string ParolaCurenta { get; set; }

        public string ParolaNoua { get; set; }

        public string ParolaNouaRe { get; set; }
    }
}