using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Interfaces;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Microsoft.Extensions.Configuration;

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
        }

        public string GetFacebookLoginUrl()
        {
            return "https://www.facebook.com/v17.0/dialog/oauth?client_id=" + FacebookClientId + "&redirect_uri=" + FacebookRedirectionUri + "&state=login";
        }

        public string GetGoogleLoginUrl()
        {
            return "https://accounts.google.com/o/oauth2/v2/auth?scope=email&state=login&include_granted_scopes=true&redirect_uri=" + GoogleRedirectionUri + "&response_type=code&client_id=" + GoogleClientId;
        }

        public string GetGoogleLoginUrlForRegister()
        {
            return "https://accounts.google.com/o/oauth2/v2/auth?scope=profile&state=register&include_granted_scopes=true&redirect_uri=" + GoogleRedirectionUri + "&response_type=code&client_id=" + GoogleClientId;
        }        

        public async Task<GoogleJsonWebSignature.Payload> GetPayloadAsync(string authCode)
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
    }
}