using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using API.Helpers;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IExternalAuthService, ExternalAuthService>();
            services.AddScoped<IAnuntRepository, AnuntRepository>();
            services.AddScoped<ILocatiiRepository, LocatiiRepository>();
            services.AddScoped<IGrupeRepository, GrupeRepository>();
            services.AddScoped<IPrezenteRepository, PrezenteRepository>();
            services.AddScoped<IInscrieriRepository, InscrieriRepository>();
            services.AddScoped<IMailService, MailService>();
            services.AddDbContext<AppIdentityContext>(opt => {
                opt.UseNpgsql(config.GetConnectionString("ElephantsqlConnection"));
                //opt.UseSqlServer(config.GetConnectionString("PleskSql"));
                //opt.UseSqlServer(config.GetConnectionString("PleskSql"));
                //opt.UseSqlite(config.GetConnectionString("SqliteConnection"));
                //opt.UseMySql(config.GetConnectionString("MariaDb"), ServerVersion.AutoDetect(config.GetConnectionString("MariaDb")));
                //opt.UseMySql(config.GetConnectionString("MariaDbRemote"), ServerVersion.AutoDetect(config.GetConnectionString("MariaDbRemote")));
                
            });
            

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<ApiBehaviorOptions>(options => {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                    .Where(e => e.Value.Errors.Count > 0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage).ToArray();
                    
                    var errorsResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };
                    return new BadRequestObjectResult(errorsResponse);
                };
            });

            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("https://localhost:4200");
                });
            });
            return services;
        }
    }
}