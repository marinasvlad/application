using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Anunt
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public DateTime DataAnunt { get; set; }

        public int AppUserId {get; set;}

        public AppUser AppUser {get; set;}
        
    }
}