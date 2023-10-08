using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Grupa
    {
        public int Id { get; set; }

        public ICollection<AppUser> Elevi { get; set; }

        public DateTime DataGrupa { get; set; }

        public DateTime OraGrupa { get; set; }

        public int LocatieId { get; set; }

        public Locatie Locatie { get; set; }

        public bool Confirmata { get; set; }

        public bool Efectuata { get; set; }

        public int NivelId { get; set; }
    }
}