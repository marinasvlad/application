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

        public int? GrupaId { get; set; }

        public int? LocatieId { get; set; }
        
        public int NumarSedinte { get; set; }
    }
}