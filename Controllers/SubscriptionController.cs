using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Skraper3FrontEnd.Controllers
{
    [Route("api/[controller]")]
    public class SubscriptionController : Controller
    {
        private SubscriptionsContext _context;
        private readonly ILogger _logger;
        public SubscriptionController(SubscriptionsContext context, ILogger<SubscriptionController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody]Subscriptions sub)
        {
            if (!ModelState.IsValid) {
                return BadRequest("Missing Email or URL.");
            }
            try {
                if (await _context.Subscriptions.AnyAsync(s => s.Email.ToUpper() == sub.Email.ToUpper() && s.URL.ToUpper() == sub.URL.ToUpper())){
                    return BadRequest("A duplicate exists.");
                }
                await _context.Subscriptions.AddAsync(sub);
            }
            catch (Exception e){
                _logger.LogError(e.ToString());
                return BadRequest("Unexpected issue when adding subscription. Please email administrator: angelusualle@gmail.com");
            }
            return Ok($"Subscribed {sub.Email} to {sub.URL}");
        }
        
    }
}
