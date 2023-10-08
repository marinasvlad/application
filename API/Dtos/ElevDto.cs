using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class ElevDto
    {
        public int Id {get; set;}
        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string NumarDeTelefon { get; set; }

        public int? GrupaId { get; set; }

        public int? LocatieId { get; set; }

        public string Locatie {get; set;}
        
        public int NumarSedinte { get; set; }

        public bool Prezent {get; set;}

        public int NivelId { get; set; }
    }
}