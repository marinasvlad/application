using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class PrezenteRepository : IPrezenteRepository
    {
        private readonly AppIdentityContext _context;
        public PrezenteRepository(AppIdentityContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<Prezenta>> GetPrezenteByUserId(int userId)
        {
            return await _context.Prezente.Where(p => p.AppUserId == userId).OrderByDescending(p => p.Data).ToListAsync();
        }

        public async Task<IReadOnlyList<Prezenta>> GetPrezenteTotiElevii()
        {
            return await _context.Prezente.OrderByDescending(p => p.Data).ToListAsync();
        }

        public async Task<bool> SetPrezentaByUserAndGrupa(AppUser user, Grupa grupa, string Locatie)
        {
            var prezenta = new Prezenta{
                Data = DateTime.Now,
                Start = DateTime.Now,
                Stop = DateTime.Now.AddHours(1),
                AppUserId = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName,
                LocatieId = (int)user.LocatieId,
                Locatie = Locatie
            };

            await _context.Prezente.AddAsync(prezenta);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}