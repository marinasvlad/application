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
        private readonly string GooglweClientSecret;
        private readonly string GoogleRedirectionUri;

        public ExternalAuthService(IConfiguration configuration)
        {
            GoogleClientId = configuration["GoogleAuth:ClientId"];
            GooglweClientSecret = configuration["GoogleAuth:ClientSecret"];
            //GoogleRedirectionUri = configuration["GoogleAuth:RedirectionUriLocal"];
            GoogleRedirectionUri = configuration["GoogleAuth:RedirectionUri"];            
        }

        public string GetGoogleLoginUrl()
        {
            return "https://accounts.google.com/o/oauth2/v2/auth?scope=email&include_granted_scopes=true&redirect_uri=" + GoogleRedirectionUri + "&response_type=code&client_id=" + GoogleClientId;
        }

        public async Task<GoogleJsonWebSignature.Payload> GetPayloadAsync(string authCode)
        {
            var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = GoogleClientId,
                    ClientSecret = GooglweClientSecret
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