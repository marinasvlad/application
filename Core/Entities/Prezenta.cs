using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Prezenta
    {
        public int Id { get; set; }

        public DateTime Data { get; set; }

        public DateTime Start { get; set; }

        public DateTime Stop { get; set; }

        public int AppUserId { get; set; }

        public string Email { get; set; }

        public string DisplayName { get; set; }

        public int LocatieId { get; set; }
    }
}