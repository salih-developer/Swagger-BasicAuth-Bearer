using SET.DataService.Model;
using System.Collections.Generic;
using System.Linq;

namespace SET.DataService
{
    public interface IAccountDataService
    {
        User GetUser(string userName, string password);
    }
    public class AccountDataService : IAccountDataService
    {
        static List<User> users=new List<User>(new []
        {
            new User{Name = "Admin",Password = "12345",UserName = "admin"},
            new User{Name = "Guess",Password = "12345",UserName = "guess"},
        });
        public User GetUser(string userName, string password)
        {
            return users.SingleOrDefault(x => x.UserName == userName && x.Password == password);
        }
    }
}
