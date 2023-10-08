using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class InscriereDto
    {
        public int Id { get; set; }

        public string DisplayName { get; set; }

        public string Email { get; set; }

        public string NumarDeTelefon { get; set; }

        public string Nivel { get; set; }

        public int Varsta { get; set; }

        public string DataCerere { get; set; }
    }
}