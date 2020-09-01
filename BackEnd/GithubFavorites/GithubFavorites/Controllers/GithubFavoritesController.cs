using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http.Results;
using System.Web.Http.Validation.Validators;
using GithubFavorites.DAL;
using GithubFavorites.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.JsonWebTokens;

namespace GithubFavorites.Controllers
{
    //[Route("api/[controller]")]
    [ApiController]
    public class GithubFavoritesController : ControllerBase
    {
        private IConfiguration configuration;
        private IMainDAL _DAL ;

        public GithubFavoritesController(IConfiguration iConfig, IMainDAL DAL)
        {
            this.configuration = iConfig;
            this._DAL = DAL;//new DAL.MainDAL(configuration);
        }

        //[AllowAnonymous]
        [Route("api/Search")]
        [HttpGet]
        public async Task<List<Repo>> Search(string srchStr)
        {

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("User-Agent", "Easy");
                var action = await client.GetAsync("https://api.github.com/search/repositories?q="+ srchStr);
                var data = await action.Content.ReadAsStringAsync();
                var json = Newtonsoft.Json.JsonConvert.DeserializeObject<RepoList>(data);

                return json.items;
            }

        }

        [Route("api/Login")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        [HttpPost]
        public IActionResult Login([FromBody]User user)
        {
            //validations
            if (string.IsNullOrEmpty(user.username) || string.IsNullOrEmpty(user.password))
                return BadRequest("Invalid username or password");

            if (this._DAL.Login(user) == 0) //LOGIN OK
            {
                var token = new JWT.JWT(this.configuration).GenerateJSONWebToken(user);
                //return new List<Repo>();
                var tokenRes = new Token()
                {
                    jwt = token
                };
                return StatusCode(202, tokenRes);
            }

            return BadRequest("Invalid username or password");
        }


        [Route("api/Register")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        [HttpPost]
        public IActionResult Register([FromBody]User user)
        {
            //validations
            if (string.IsNullOrEmpty(user.username) || string.IsNullOrEmpty(user.password))
                return BadRequest("Invalid username or password");

            if (this._DAL.RegisterUser(user) > 0) //LOGIN OK
            {
                return StatusCode(202, new User() { username = user.username});
            }

            return BadRequest("Invalid username or password");
        }


        [Route("api/AddFavorite")]
        public IActionResult AddFavorite(Repo repo)
        {
            var currentUser = HttpContext.User;
            string user_name = currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;

            var result = this._DAL.AddFavorite(repo, user_name);
            if (result == 1)
                return new OkObjectResult(result);
            else
                return BadRequest("Failed adding new repository.");
        }

        [Route("api/GetFavorites")]
        public List<Repo> GetFavorites()
        {
            var currentUser = HttpContext.User;
            string user_name = currentUser.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;

            return this._DAL.GetFavorites(user_name);
        }
    }
}