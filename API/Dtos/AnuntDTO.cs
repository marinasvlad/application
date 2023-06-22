using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class AnuntDTO
    {
        public int Id { get; set; }

        public string Autor { get; set; }

        public string Text { get; set; }

        public string Data { get; set; }
    }
}