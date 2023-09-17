using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppIdentityContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>,
     AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public AppIdentityContext(DbContextOptions<AppIdentityContext> options) : base(options)
        {

        }

        public DbSet<Grupa> Grupe {get; set;}

        public DbSet<Anunt> Anunturi {get; set;}

        public DbSet<Locatie> Locatii { get; set; }

        public DbSet<Prezenta> Prezente { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);
            
            builder.Entity<AppUser>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();            

            builder.Entity<AppRole>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

            builder.Entity<AppUser>()
            .HasOne(a => a.Grupa)
            .WithMany(g => g.Elevi)
            .HasForeignKey(c => c.GrupaId)
            .IsRequired(false);

            builder.Entity<AppUser>()
            .HasOne(u => u.Locatie)
            .WithMany(l => l.Elevi)
            .HasForeignKey(u => u.LocatieId)
            .IsRequired(false);

            builder.Entity<AppUser>()
            .HasMany(a => a.Anunturi)
            .WithOne(b => b.AppUser)
            .HasForeignKey(b => b.AppUserId);

            builder.Entity<Anunt>()
            .HasOne(a => a.Locatie)
            .WithMany(a => a.AnunturiLocatie)
            .HasForeignKey(a => a.LocatieId)
            .IsRequired(false);

            builder.Entity<Locatie>()
            .HasMany(l => l.AnunturiLocatie)
            .WithOne(a => a.Locatie)
            .HasForeignKey(a => a.LocatieId)
            .IsRequired(false);

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            if(Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                foreach(var entityType in builder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
                    foreach(var property in properties)
                    {
                        builder.Entity(entityType.Name).Property(property.Name)
                        .HasConversion<double>();
                    }
                }
            }

        }
    }
}