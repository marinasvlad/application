using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IPrezenteRepository
    {
        Task<bool> SetPrezentaByUserAndGrupa(AppUser user, Grupa grupa, string Locatie);

        Task<IReadOnlyList<Prezenta>> GetPrezenteByUserId(int userId);

        Task<IReadOnlyList<Prezenta>> GetPrezenteTotiElevii();
    }
}