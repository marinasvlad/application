using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class InscrieriRepository : IInscrieriRepository
    {
        private readonly AppIdentityContext _context;
        public InscrieriRepository(AppIdentityContext context)
        {
            _context = context;
        }

        public async Task<bool> AdaugaInscriereAsync(Inscriere inscriere)
        {
            await _context.Inscrieri.AddAsync(inscriere);

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Inscriere> GetInscriereByIdAsync(int inscriereId)
        {
            var invoire = await _context.Inscrieri.FirstOrDefaultAsync(i => i. Id == inscriereId);

            return invoire;
        }

        public async Task<IReadOnlyList<Inscriere>> GetInscrieriAsync()
        {
            return await _context.Inscrieri.ToListAsync();
        }

        public async Task<bool> StergeInscriereById(int inscriereId)
        {
            var inscriere = await _context.Inscrieri.FirstOrDefaultAsync(i => i.Id == inscriereId);

            _context.Inscrieri.Remove(inscriere);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}