using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.Facebook;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
namespace Infrastructure.Services
{
    public class ExternalAuthService : IExternalAuthService
    {
        private readonly string GoogleClientId;
        private readonly string GoogleClientSecret;
        private readonly string GoogleRedirectionUri;
        private readonly string FacebookClientId;
        private readonly string FacebookClientSecret;
        private readonly string FacebookRedirectionUri;

        public ExternalAuthService(IConfiguration configuration)
        {
            GoogleClientId = configuration["GoogleAuth:ClientId"];
            GoogleClientSecret = configuration["GoogleAuth:ClientSecret"];
            GoogleRedirectionUri = configuration["GoogleAuth:RedirectionUriLocal"];
            //GoogleRedirectionUri = configuration["GoogleAuth:RedirectionUri"];            
            FacebookClientId = configuration["FacebookAuth:ClientId"];
            FacebookClientSecret = configuration["FacebookAuth:ClientSecret"];
            FacebookRedirectionUri = configuration["FacebookAuth:RedirectionUriLocal"];
            //FacebookRedirectionUri = configuration["FacebookAuth:RedirectionUri"];            

        }

        public string GetFacebookLoginUrl()
        {
            return "https://www.facebook.com/v17.0/dialog/oauth?client_id=" + FacebookClientId + "&redirect_uri=" + FacebookRedirectionUri + "&state=facebooklogin&scope=email";
        }

        public string GetFacebookRegisterUrl()
        {
            return "https://www.facebook.com/v17.0/dialog/oauth?client_id=" + FacebookClientId + "&redirect_uri=" + FacebookRedirectionUri + "&state=facebookregister&scope=email";
        }

        public string GetGoogleLoginUrl()
        {
            return "https://accounts.google.com/o/oauth2/v2/auth?scope=email&state=googlelogin&include_granted_scopes=true&redirect_uri=" + GoogleRedirectionUri + "&response_type=code&client_id=" + GoogleClientId;
        }

        public string GetGoogleRegisterUrl()
        {
            return "https://accounts.google.com/o/oauth2/v2/auth?scope=profile&state=googleregister&include_granted_scopes=true&redirect_uri=" + GoogleRedirectionUri + "&response_type=code&client_id=" + GoogleClientId;
        }

        public async Task<GoogleJsonWebSignature.Payload> GetGooglePayloadAsync(string authCode)
        {
            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = GoogleClientId,
                    ClientSecret = GoogleClientSecret
                }
            });

            var token = await flow.ExchangeCodeForTokenAsync(null, authCode, GoogleRedirectionUri, CancellationToken.None);
            string googleToken = token.IdToken;

            GoogleJsonWebSignature.ValidationSettings settings = new GoogleJsonWebSignature.ValidationSettings();


            settings.Audience = new List<string>() { GoogleClientId };

            GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(googleToken, settings).Result;

            return payload;
        }

        public async Task<(string, string)> GetFacebookPayloadAsync(string authCode)
        {

            string userName = string.Empty;
            string userEmail = string.Empty;

            using (var client = new HttpClient())
            {
                var tokenEndpoint =
                 $"https://graph.facebook.com/v17.0/oauth/access_token?client_id="+ FacebookClientId + "&redirect_uri=http://test.borgdesign.ro/&client_secret=" + FacebookClientSecret + "&code=" + authCode;

                var response = await client.GetAsync(tokenEndpoint);

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    JObject jsonObject = JsonConvert.DeserializeObject<JObject>(jsonString);
                    string accessToken = jsonObject["access_token"].ToString();

                    string fields = "name,email,first_name,last_name";

                    string requestUrl = $"https://graph.facebook.com/v17.0/me?fields={fields}&access_token={accessToken}";
                    response = await client.GetAsync(requestUrl);
                    jsonString = await response.Content.ReadAsStringAsync();
                    JObject userData = JsonConvert.DeserializeObject<JObject>(jsonString);

                    userEmail = userData["email"].ToString();
                    userName = userData["name"].ToString();
                }
            }
            return (userName,userEmail);

        }
    }
}