using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class SplitGrupaDto
    {

        public int IdGrupaInitiala { get; set; }

        public int LocatieIdGrupaInitiala { get; set; }

        public IReadOnlyList<ElevDto> EleviGrupaInitiala { get; set; }

        public int LocatieIdGrupaSplit { get; set; }

        public IReadOnlyList<ElevDto> EleviGrupaSplit { get; set; }

        public string DataGrupaSplit { get; set; }

        public string OraGrupaSplit { get; set; }

    }
}