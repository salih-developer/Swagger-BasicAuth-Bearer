using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SET.DataService;
using SET.DataService.Model;

namespace SET.Business
{
    public interface IAccountBusiness
    {
        string GetToken(string userName, string password);
    }
    public class AccountBusiness : IAccountBusiness
    {
        private readonly AccountDataService accountDataService = new AccountDataService();
        public string GetToken(string userName, string password)
        {
            var user = accountDataService.GetUser(userName, password);
            return UserCheckIfIsExistsTokenCreate(user);
        }

        private string UserCheckIfIsExistsTokenCreate(User user)
        {
            if (user == null)
                return string.Empty;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("you can write key that would like :)");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("UserName", user.UserName),
                    //new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
