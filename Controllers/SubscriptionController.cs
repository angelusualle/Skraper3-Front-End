using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Skraper3FrontEnd.Controllers
{
    [Route("api/[controller]")]
    public class SubscriptionController : Controller
    {
        [HttpPost("Add")]
        public IActionResult Add([FromBody]Subscription sub)
        {
            if (!ModelState.IsValid) {
                return BadRequest("Missing Email or URL.");
            }
            return Ok($"Subscribed {sub.Email} to {sub.URL}");
        }
        
    }
}
