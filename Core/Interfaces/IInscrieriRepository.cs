using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IInscrieriRepository
    {
        Task<IReadOnlyList<Inscriere>> GetInscrieriAsync();

        Task<bool> AdaugaInscriereAsync(Inscriere inscriere);

        Task<Inscriere> GetInscriereByIdAsync(int inscriereId);

        Task<bool> StergeInscriereById(int inscriereId);

    }
}