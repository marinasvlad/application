using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth;

namespace Core.Interfaces
{
    public interface IExternalAuthService
    {
        Task<GoogleJsonWebSignature.Payload> GetPayloadAsync(string authCode);

        string GetGoogleLoginUrl();

        string GetGoogleLoginUrlForRegister();

        string GetFacebookLoginUrl();

    }
}