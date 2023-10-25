using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using Core.Interfaces;

namespace Infrastructure.Services
{
    public class MailService : IMailService
    {
        public bool SendLinkCuToken(string email, string token)
        {
            MailMessage message = new MailMessage();
            message.From = new MailAddress("service@apa.marinasnet.ro", "Vlad Marinas");

            message.To.Add(email);

            string encodedToken = HttpUtility.UrlEncode(token);
            message.Subject = "Link de recuperare parolă";
            message.Body = "Linkul de schimbare a parolei contului tau este https://apa.marinasnet.ro?actiune=resetparola&email="+email+"&token="+encodedToken;
            var client = new SmtpClient("mail.2mwin-dns.com", 25);
            client.Credentials = new NetworkCredential("service@apa.marinasnet.ro", "Marinasnetro");
            try
            {
                client.Send(message);
            }
            catch (Exception exception)
            {
                exception.ToString();
            }
            return true;
        }
    }
}