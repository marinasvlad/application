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
    }
}