using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Paging
{
    public class UserParams
    {
        private const int MaxPageSize = 10;

        public int pageNumber { get; set; } = 1;

        public int locationId {get; set;}

        private int _pageSize = 10;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
    }
}