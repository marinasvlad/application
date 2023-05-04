using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class Seed
    {
        public static async Task SeedRoles(RoleManager<AppRole> roleManager)
        {

            if (!await roleManager.Roles.AnyAsync())
            {

                var roles = new List<AppRole>
                {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
                };
                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
            }

        }

        public static async Task SeedUsers(RoleManager<AppRole> roleManager, UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var usersData = System.IO.File.ReadAllText("../Infrastructure/Data/SeedData/users.json");

                var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};

                var users = JsonSerializer.Deserialize<List<AppUser>>(usersData);

                if(users != null)
                {

                    var userMember = new AppUser{
                        DisplayName = users[0].DisplayName.ToUpper(),
                        Email = users[0].Email,
                        UserName = users[0].Email
                    };
                    await userManager.CreateAsync(userMember,"Pa$$w0rd");
                    await userManager.AddToRoleAsync(userMember, "Member");

                    var userModerator = new AppUser{
                        DisplayName = users[1].DisplayName.ToUpper(),
                        Email = users[1].Email,
                        UserName = users[1].Email
                    };

                    await userManager.CreateAsync(userModerator,"Pa$$w0rd");
                    await userManager.AddToRolesAsync(userModerator, new[] { "Moderator", "Member" });

                    var usersAdmin = new AppUser{
                        DisplayName = users[2].DisplayName.ToUpper(),
                        Email = users[2].Email,
                        UserName = users[2].Email
                    };
                    await userManager.CreateAsync(usersAdmin,"Pa$$w0rd");
                    await userManager.AddToRolesAsync(usersAdmin, new[] { "Admin", "Moderator", "Member" });                    
    
                }
            }
        }        
    }
}