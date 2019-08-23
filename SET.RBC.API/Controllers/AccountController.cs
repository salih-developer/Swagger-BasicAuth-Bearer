using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SET.Business;
using SET.RBC.API.Model;

namespace SET.RBC.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private AccountBusiness _accountBusiness = new AccountBusiness();

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]UserModel userModel)
        {
            var token = _accountBusiness.GetToken(userModel.Username, userModel.Password);
            return new JsonResult(new { token = token });
        }
    }
}