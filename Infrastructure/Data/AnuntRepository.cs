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
            var query = _context.Anunturi.OrderBy(a => a.DataAnunt).Include(a => a.AppUser).Where(a => a.AppUser.LocatieId == userParams.locationId).OrderByDescending(a => a.DataAnunt).AsNoTracking();

            return await PagedList<Anunt>.CreateAsync(query, userParams.pageNumber, userParams.PageSize);
        }

        public async Task<PagedList<Anunt>> GetAnunturiCustomAsync(UserParams userParams)
        {
            if(userParams.locationId >= 1 && userParams.locationId <= 3)
            {
                //var query = _context.Anunturi.Where(a => a.AppUser.LocatieId == userParams.locationId).OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).AsNoTracking();
                var query = _context.Anunturi.Where(a => a.LocatieId == userParams.locationId).OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).AsNoTracking();
                return await PagedList<Anunt>.CreateAsync(query, userParams.pageNumber, userParams.PageSize);

            }
            else
            {
                var query = _context.Anunturi.OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).AsNoTracking();
                return await PagedList<Anunt>.CreateAsync(query, userParams.pageNumber, userParams.PageSize);
            }
            

        }        

        public async Task<IReadOnlyList<Anunt>> GetAnunturiPaginatedAsync(int skip, int take)
        {
            return await _context.Anunturi.OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<IReadOnlyList<Anunt>> GetAnunturiPaginatedByLocationIdAsync(int skip, int take, int locationId)
        {
            return await _context.Anunturi.Where(a => a.LocatieId == locationId).OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).Skip(skip).Take(take).ToListAsync();
        }        

        public async Task<PagedList<Anunt>> GetAnunturiToateLocatiileAsync(UserParams userParams)
        {
            var query = _context.Anunturi.OrderBy(a => a.DataAnunt).Include(a => a.AppUser).OrderByDescending(a => a.DataAnunt).AsNoTracking();

            return await PagedList<Anunt>.CreateAsync(query, userParams.pageNumber, userParams.PageSize);        
        }

        public async Task<int> GetPageSize(AppUser user)
        {
            var anunturi = await _context.Anunturi.Where(a => a.AppUser.LocatieId == user.LocatieId).ToListAsync();

            return anunturi.Count;
        }

        public async Task<int> GetPageSizeByLocatieId(int locatieId)
        {
            var anunturi = await _context.Anunturi.Where(a => a.AppUser.LocatieId == locatieId).ToListAsync();

            return anunturi.Count;
        }

        public async Task<int> GetPageSizeToate(AppUser user)
        {
            var anunturi = await _context.Anunturi.ToListAsync();

            return Convert.ToInt32(anunturi.Count);
        }

        public async Task<bool> PostAnunt(Anunt anunt)
        {
            await _context.Anunturi.AddAsync(anunt);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}