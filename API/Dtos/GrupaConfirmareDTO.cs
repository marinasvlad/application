using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class GrupaConfirmareDTO
    {
        public int Id { get; set; }

        public int LocatieId { get; set; }

        public IReadOnlyList<ElevDto> Elevi { get; set; }
    }
}