using GithubFavorites.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace GithubFavorites.DAL
{
    public interface IMainDAL
    {
        public int Login(User user);
        public int AddFavorite(Repo repo, string username);
        public List<Repo> GetFavorites(string username);
        public int RegisterUser(User user);
    }


    public class MainDAL : IMainDAL
    {
        string _connStr = String.Empty;
        private IConfiguration configuration;


        public MainDAL(IConfiguration iConfig)
        {
            this.configuration = iConfig;
            this._connStr = this.configuration.GetSection("ConnectionStrings").GetSection("WebAppDB").Value;
        }




        public int Login(User user)
        {
            try
            {

                using (var conn = new MySqlConnection())
                {
                    conn.ConnectionString = this._connStr; 
                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.CommandText = string.Format("SELECT * FROM tb_users WHERE username = '{0}' AND password = '{1}'", user.username.ToLower(), user.password);

                        using (var rdr = cmd.ExecuteReader())
                        {
                            rdr.Read();
                            if (rdr["username"] != null)
                                return 0; //OK

                        }

                        return -1;
                    }
                }
            }
            catch (Exception ex)
            {
                return -1;
            }
        }


        public int AddFavorite(Repo repo, string username)
        {

            try
            {

                using (var conn = new MySqlConnection())
                {
                    //var a = this.configuration.GetSection("ConnectionStrings").GetSection("WebAppDB").Value;
                    conn.ConnectionString = this._connStr; //"Persist Security Info=False;Server=192.168.38.133;Database=PyCrawler;Uid=root;Pwd=123456;"; // ConfigurationManager.ConnectionStrings[0].ToString();
                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.CommandText = string.Format("INSERT INTO tb_favorites (username, repo_id, repo_name) " +
                                                        "VALUES ('{0}' , {1}, '{2}')", username, repo.id, repo.full_name);

                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                return -1;
            }
        }


        public List<Repo> GetFavorites(string username)
        {
            var repos = new List<Repo>();

            try
            {
                using (var conn = new MySqlConnection())
                {
                    //var a = this.configuration.GetSection("ConnectionStrings").GetSection("WebAppDB").Value;
                    conn.ConnectionString = this._connStr; //"Persist Security Info=False;Server=192.168.38.133;Database=PyCrawler;Uid=root;Pwd=123456;"; // ConfigurationManager.ConnectionStrings[0].ToString();
                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.CommandText = string.Format("SELECT f.* FROM tb_users u " +
                                                        "INNER JOIN tb_favorites f ON f.username = u.username " +
                                                        "WHERE u.username = '{0}'", username);

                        using (var rdr = cmd.ExecuteReader())
                        {
                            while (rdr.Read())
                            {
                                repos.Add(new Repo()
                                {
                                    id = int.Parse(rdr["repo_id"].ToString()),
                                    full_name = rdr["repo_name"].ToString()
                                });
                            }
                        }

                        return repos;
                    }
                }
            }
            catch (Exception ex)
            {
                return repos;
            }
        }

        public int RegisterUser(User user)
        {
            //var repos = new List<Repo>();

            try
            {
                using (var conn = new MySqlConnection())
                {
                    //var a = this.configuration.GetSection("ConnectionStrings").GetSection("WebAppDB").Value;
                    conn.ConnectionString = this._connStr; //"Persist Security Info=False;Server=192.168.38.133;Database=PyCrawler;Uid=root;Pwd=123456;"; // ConfigurationManager.ConnectionStrings[0].ToString();
                    conn.Open();
                    using (var cmd = new MySqlCommand())
                    {
                        cmd.Connection = conn;
                        cmd.CommandType = System.Data.CommandType.Text;
                        cmd.CommandText = string.Format("INSERT INTO Tiba.tb_users (username, password) " +
                                                        "VALUES('{0}', '{1}'); ", user.username.ToLower(), user.password);

                        return cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                return -1;
            }
        }
    }
}
