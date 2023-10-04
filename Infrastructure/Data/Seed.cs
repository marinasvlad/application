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

        public static async Task SeedUsers(RoleManager<AppRole> roleManager, UserManager<AppUser> userManager, AppIdentityContext context)
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
                        UserName = users[0].Email,
                    };
                    await userManager.CreateAsync(userMember,"Pa$$w0rd");
                    await userManager.AddToRoleAsync(userMember, "Member");

                    var userModerator = new AppUser{
                        DisplayName = users[1].DisplayName.ToUpper(),
                        Email = users[1].Email,
                        UserName = users[1].Email
                    };

                    await userManager.CreateAsync(userModerator,"Pa$$w0rd");
                    await userManager.AddToRoleAsync(userModerator, "Moderator");

                    var usersAdmin = new AppUser{
                        DisplayName = users[2].DisplayName.ToUpper(),
                        Email = users[2].Email,
                        UserName = users[2].Email
                    };

                    await userManager.CreateAsync(usersAdmin,"Pa$$w0rd");
                    await userManager.AddToRoleAsync(usersAdmin, "Admin");


                    var locatii = await context.Locatii.ToListAsync();

                    for(int i = 1; i <= 15; i++)
                    {
                        var userWaterPark = new AppUser{
                        DisplayName = "Member " + i + " WaterPark",
                        Email = "memberwp" + i + "@test.com",
                        UserName = "memberwp" + i + "@test.com",
                        LocatieId = locatii[0].Id,
                        NumarSedinte = 10
                        };


                        await userManager.CreateAsync(userWaterPark,"Pa$$w0rd");
                        await userManager.AddToRoleAsync(userWaterPark, "Member");

                    }

                    for(int i = 1; i <= 15; i++)
                    {
                        var userWaterPark = new AppUser{
                        DisplayName = "Member " + i + " ImperialGarden",
                        Email = "memberig" + i + "@test.com",
                        UserName = "memberig" + i + "@test.com",
                        LocatieId = locatii[1].Id,
                        NumarSedinte = 8                        
                        };

                        
                        await userManager.CreateAsync(userWaterPark,"Pa$$w0rd");
                        await userManager.AddToRoleAsync(userWaterPark, "Member");

                    }

                    for(int i = 1; i <= 15; i++)
                    {
                        var userWaterPark = new AppUser{
                        DisplayName = "Member " + i + " BaziunulCarol",
                        Email = "memberbc" + i + "@test.com",
                        UserName = "memberbc" + i + "@test.com",
                        LocatieId = locatii[2].Id,
                        NumarSedinte = 8                        
                        };

                        await userManager.CreateAsync(userWaterPark,"Pa$$w0rd");
                        await userManager.AddToRoleAsync(userWaterPark, "Member");

                    }                                                         
    
                    //     var vladMarinas = new AppUser{
                    //     DisplayName = users[3].DisplayName.ToUpper(),
                    //     Email = users[3].Email,
                    //     UserName = users[3].Email
                    // };
                    // await userManager.CreateAsync(vladMarinas,"Pa$$w0rd");
                    // await userManager.AddToRoleAsync(vladMarinas,"Admin" );   
                }
            }
        }


        public static async Task SeedLocatii(AppIdentityContext context)
        {
           if(!context.Locatii.Any())
           {
                var waterPark = new Locatie();
                waterPark.NumeLocatie = "Water Park";

                var imperialGarden = new Locatie();
                imperialGarden.NumeLocatie = "Imperial Garden";

                var bazinulCarol = new Locatie();
                bazinulCarol.NumeLocatie = "Bazinul Carol";

                context.Locatii.Add(waterPark);
                context.Locatii.Add(imperialGarden);
                context.Locatii.Add(bazinulCarol);

                await context.SaveChangesAsync();
           }
        }


        public static async Task SeedAnunturi(AppIdentityContext context)
        {
           if(!context.Anunturi.Any())
           {

                var user = await context.Users.FirstOrDefaultAsync(u => u.Id == 2);

                var locatii = await context.Locatii.ToListAsync();
                for(int i = 1; i <= 40; i++)
                {
                    Anunt anunt = new Anunt();
                    anunt.AppUserId = user.Id;
                    anunt.AppUser = user;     
                    anunt.DataAnunt = DateTime.Now;
                    anunt.Text = "Anuntul " + i + " pus la locatia Water Park";
                    anunt.Locatie = locatii[0];
                    anunt.LocatieId = locatii[0].Id;
                    context.Anunturi.Add(anunt);
                }


                for(int i = 1; i <= 40; i++)
                {
                    Anunt anunt = new Anunt();
                    anunt.AppUserId = user.Id;
                    anunt.AppUser = user;     
                    anunt.DataAnunt = DateTime.Now;
                    anunt.Text = "Anuntul " + i + " pus la locatia Imperial Garden";
                    anunt.Locatie = locatii[1];
                    anunt.LocatieId = locatii[1].Id;
                    context.Anunturi.Add(anunt);
                }     


                for(int i = 1; i <= 40; i++)
                {
                    Anunt anunt = new Anunt();
                    anunt.AppUserId = user.Id;
                    anunt.AppUser = user;     
                    anunt.DataAnunt = DateTime.Now;
                    anunt.Text = "Anuntul " + i + " pus la locatia Bazinul Carol";
                    anunt.Locatie = locatii[2];
                    anunt.LocatieId = locatii[2].Id;
                    context.Anunturi.Add(anunt);
                }                           


                await context.SaveChangesAsync();
           }
        }               
    }
}