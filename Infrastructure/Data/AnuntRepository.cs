using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AnuntRepository : IAnuntRepository
    {
        private readonly AppIdentityContext _context;
        public AnuntRepository(AppIdentityContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteAnunt(int anuntId)
        {
            var anunt = await _context.Anunturi.FirstOrDefaultAsync(a => a.Id == anuntId);

            _context.Anunturi.Remove(anunt);

            return  await _context.SaveChangesAsync() > 0;

        }

        public async Task<IReadOnlyList<Anunt>> GetAnunturiAsync()
        {
            return await _context.Anunturi.OrderBy(a => a.DataAnunt).ToListAsync();
        }

        public async Task<bool> PostAnunt(Anunt anunt)
        {
            await _context.Anunturi.AddAsync(anunt);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}