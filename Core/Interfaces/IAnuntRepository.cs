using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Paging;

namespace Core.Interfaces
{
    public interface IAnuntRepository
    {
        Task<PagedList<Anunt>> GetAnunturiAsync(UserParams userParams);

        Task<IReadOnlyList<Anunt>> GetAnunturiPaginatedAsync(int skip, int take);

        Task<bool> PostAnunt(Anunt anunt);

        Task<bool> DeleteAnunt(int anuntId);

    }
}