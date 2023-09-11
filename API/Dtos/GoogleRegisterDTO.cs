using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class OauthRegisterDTO
    {
        public string DisplayName { get; set; }

        public string Email { get; set; }

        public int LocatieNumar { get; set; }

        public string Provider { get; set; }
    }
}