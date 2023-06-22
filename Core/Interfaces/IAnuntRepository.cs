using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IAnuntRepository
    {
        Task<IReadOnlyList<Anunt>> GetAnunturiAsync();

        Task<bool> PostAnunt(Anunt anunt);

        Task<bool> DeleteAnunt(int anuntId);
    }
}