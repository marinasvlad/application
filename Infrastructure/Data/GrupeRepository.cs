using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GrupeRepository : IGrupeRepository
    {
        private readonly AppIdentityContext _context;
        public GrupeRepository(AppIdentityContext context)
        {
            _context = context;
        }

        public async Task<bool> AddElevToGrupa(AppUser elev, Grupa grupa)
        {
            grupa.Elevi.Add(elev);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddNewGrupa(Grupa grupa)
        {
            await _context.Grupe.AddAsync(grupa);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ConfirmaGrupa(int grupaId)
        {
            var grupa = await _context.Grupe.FirstOrDefaultAsync(g => g.Id == grupaId);

            grupa.Confirmata = true;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteGrupaById(int grupaId)
        {
            var grupa = await _context.Grupe.Include(g => g.Elevi).FirstOrDefaultAsync(g => g.Id == grupaId);

            grupa.Elevi.Clear();

            _context.Grupe.Remove(grupa);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> EfectueazaGrupaAsync(Grupa grupa)
        {
            grupa.Efectuata = true;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Grupa> GetGrupaByIdAsync(int grupaId)
        {
            return await _context.Grupe.Include(g => g.Elevi).FirstOrDefaultAsync(g => g.Id == grupaId);
        }

        public async Task<IReadOnlyList<Grupa>> GetToateGrupeleActive()
        {
            return await _context.Grupe.Where(g => g.DataGrupa.Date >= DateTime.Now.Date && g.Efectuata == false).Include(g => g.Elevi).Include(g => g.Locatie).ToListAsync();
        }

        public async Task<Grupa> GetUrmatoareaGrupaActivaByLocatieId(int locatieId)
        {
            return await _context.Grupe.Include(g => g.Elevi).FirstOrDefaultAsync(g => g.LocatieId == locatieId && g.Efectuata == false && g.DataGrupa.Date >= DateTime.Now.Date);
        }

        public async Task<bool> RenuntaLaConfirmare(int grupaId)
        {
            var grupa = await _context.Grupe.FirstOrDefaultAsync(g => g.Id == grupaId);

            grupa.Confirmata = false;

            return await _context.SaveChangesAsync() > 0;        
        }

        public async Task<bool> RenuntElevToGrupa(AppUser elev, Grupa grupa)
        {
            grupa.Elevi.Remove(elev);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}