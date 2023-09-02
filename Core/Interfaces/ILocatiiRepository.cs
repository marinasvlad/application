using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface ILocatiiRepository
    {
        Task<Locatie> GetLocatieByIdAsync(int locatieId);

        Task<bool> AddNewUserToLocatieAsync(AppUser user);
    }
}