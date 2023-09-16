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

        Task<PagedList<Anunt>> GetAnunturiToateLocatiileAsync(UserParams userParams);
        Task<PagedList<Anunt>> GetAnunturiCustomAsync(UserParams userParams);
        Task<IReadOnlyList<Anunt>> GetAnunturiPaginatedByLocationIdAsync(int skip,int take, int locationId);
        Task<IReadOnlyList<Anunt>> GetAnunturiPaginatedAsync(int skip, int take);

        Task<bool> PostAnunt(Anunt anunt);

        Task<bool> DeleteAnunt(int anuntId);

        Task<int> GetPageSize(AppUser user);

        Task<int> GetPageSizeToate(AppUser user);

        Task<int> GetPageSizeByLocatieId(int locatieId);



    }
}