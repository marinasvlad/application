using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string DisplayName { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}