using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Google.Apis.Auth;

namespace Core.Interfaces
{
    public interface IExternalAuthService
    {
        Task<GoogleJsonWebSignature.Payload> GetGooglePayloadAsync(string authCode);

        Task<(string,string)> GetFacebookPayloadAsync(string authCode);
        string GetGoogleLoginUrl();

        string GetGoogleRegisterUrl();

        string GetFacebookLoginUrl();

        string GetFacebookRegisterUrl();

    }
}