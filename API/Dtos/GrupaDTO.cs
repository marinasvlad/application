using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace API.Dtos
{
    public class GrupaDTO
    {
        public int Id { get; set; }

        public string DataGrupa { get; set; }

        public string OraGrupa { get; set; }

        public int LocatieId { get; set; }

        public string Locatie { get; set; }

        public IReadOnlyList<AppUser> Elevi { get; set; }

        public bool Particip { get; set; }
    }
}