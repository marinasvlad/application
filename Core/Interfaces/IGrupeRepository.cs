using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IGrupeRepository
    {
        Task<Grupa> GetGrupaByIdAsync(int grupaId);
        Task<bool> AddNewGrupa(Grupa grupa);

        Task<int> AddNewGrupaAndReturnId(Grupa grupa);

        Task<bool> DeleteGrupaById(int grupaId);

        Task<IReadOnlyList<Grupa>> GetToateGrupeleActive();

        Task<bool> ConfirmaGrupa(int grupaId);

        Task<bool> RenuntaLaConfirmare(int grupaId);

        Task<bool> AddElevToGrupa(AppUser elev, Grupa grupa);

        Task<bool> RenuntElevToGrupa(AppUser elev, Grupa grupa);

        Task<Grupa> GetUrmatoareaGrupaActivaByLocatieIdAndNivelId(int locatieId, int nivelId);

        Task<bool> EfectueazaGrupaAsync(Grupa grupa);
    }
}