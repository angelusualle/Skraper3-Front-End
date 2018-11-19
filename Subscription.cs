using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Threading.Tasks;

namespace Skraper3FrontEnd
{
    public class Subscription
    {
        [Required]
        public string Email {get;set;}
        public string MobileNumber{get;set;}
        [Required]
        public string URL{get;set;}
        public string XPath {get;set;}
        public bool Changed {get;set;}
        public Task<HttpResponseMessage> response {get;set;}

        public int NumberOfErrors {get;set;} = 0;
    }
}