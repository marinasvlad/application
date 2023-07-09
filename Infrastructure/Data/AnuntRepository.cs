using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Paging;
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

        public async Task<PagedList<Anunt>> GetAnunturiAsync(UserParams userParams)
        {
            var query = _context.Anunturi.OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).AsNoTracking();

            return await PagedList<Anunt>.CreateAsync(query, userParams.pageNumber, userParams.PageSize);
        }

        public async Task<IReadOnlyList<Anunt>> GetAnunturiPaginatedAsync(int skip, int take)
        {
            return await _context.Anunturi.OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<bool> PostAnunt(Anunt anunt)
        {
            await _context.Anunturi.AddAsync(anunt);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}