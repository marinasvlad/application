using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class PrezentaDTO
    {
        public int Id { get; set; }

        public string Data { get; set; }

        public string Start { get; set; }

        public string Stop { get; set; }

        public string Email { get; set; }

        public string DisplayName { get; set; }

        public string Locatie { get; set; }
    }
}