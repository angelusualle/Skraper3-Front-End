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
        private SubscriptionsContext _context;
        public SubscriptionController(SubscriptionsContext context)
        {
            _context = context;
            
        }
        [HttpPost("Add")]
        public IActionResult Add([FromBody]Subscriptions sub)
        {
            if (!ModelState.IsValid) {
                return BadRequest("Missing Email or URL.");
            }
            var test = _context.Subscriptions.First();
            return Ok($"Subscribed {sub.Email} to {sub.URL}");
        }
        
    }
}
