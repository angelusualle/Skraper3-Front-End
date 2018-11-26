using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
                //Trim fields
                Trim(sub);
                //Validate
                if (!IsValidUrl(sub)) return BadRequest($"URL was not found: {sub.Url}. Try Again.");
                if (!IsValidEmail(sub)) return BadRequest($"Email not formatted properly: {sub.Email}. Try Again.");
                if (await _context.Subscriptions.AnyAsync(s => s.Email.ToUpper() == sub.Email.ToUpper() && s.Url.ToUpper() == sub.Url.ToUpper())){
                    return Conflict("A subscription with this email and URL already exists. Try Again.");
                }
                //Fix Endings and what not.
                if (sub.MobileNumber.Trim().Count() == 9) sub.MobileNumber = "1" + sub.MobileNumber.Trim(); //Merica
                await _context.Subscriptions.AddAsync(sub);
                await _context.SaveChangesAsync();
            }
            catch (Exception e){
                _logger.LogError(e.ToString());
                return BadRequest("Unexpected issue when adding subscription. Please email administrator: angelusualle@gmail.com");
            }
            return Ok($"Subscribed {sub.Email} to {sub.Url}");
        }

        private void Trim(Subscriptions sub)
        {
            sub.Email = sub.Email.Trim();
            sub.MobileNumber = sub.MobileNumber.Trim();
            sub.Xpath = sub.Xpath.Trim();

        }

        private bool IsValidEmail(Subscriptions sub)
        {
            return true;
        }
        private bool IsValidUrl(Subscriptions sub)
        {
            HttpClient client = new HttpClient();
            try {
                var response = client.GetAsync(sub.Url).GetAwaiter().GetResult();
                if ((int)response.StatusCode != 200){
                    return false;
                }
                else return true;
            }
            catch (Exception e){
                return false;
            }
        }
    }
}
