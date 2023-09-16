using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Locatie
    {
        public int Id { get; set; }

        public string NumeLocatie { get; set; }

        public ICollection<AppUser> Elevi { get; set; }

        public ICollection<Anunt> AnunturiLocatie {get; set;}
    }
}