using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class LocatiiRepository : ILocatiiRepository
    {
        private readonly AppIdentityContext _context;
        public LocatiiRepository(AppIdentityContext context)
        {
            _context = context;
        }

        public async Task<bool> AddNewUserToLocatieAsync(AppUser user)
        {
            var locatie =  await _context.Locatii.FirstOrDefaultAsync(loc => loc.Id == user.LocatieId);
            locatie.Elevi.Add(user);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Locatie> GetLocatieByIdAsync(int locatieId)
        {
            return await _context.Locatii.FirstOrDefaultAsync(loc => loc.Id == locatieId);
        }
    }
}