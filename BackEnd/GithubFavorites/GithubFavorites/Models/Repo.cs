using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GithubFavorites.Models
{
    public class Repo
    {
        public int id { get; set; }
        //public string node_id { get; set; }
        //public string name { get; set; }
        public string full_name { get; set; }
    }

    public class RepoList
    {
        public List<Repo> items { get; set; }
    }
}
