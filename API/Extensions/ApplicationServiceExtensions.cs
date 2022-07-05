using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Repository;
using API.Services;
using API.SignalR;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration configuration)
        {
            services.AddSingleton<PresenceTracker>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();

            //services.AddScoped<IUserRepository, UserRepository>();
            //services.AddScoped<ILikesRepository, LikesRepository>();
            //services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<LogUserActivity>();
            services.AddAutoMapper(typeof (AutoMapperProfiles).Assembly);
            services.Configure<CloudinaySettings>(configuration.GetSection("CloudinarySettings"));

            //services.AddDbContext<DataContext>(options =>
            //    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            services.AddDbContext<DataContext>(options => 
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                string connectionString;

                // Depending on if in development or production, use either Heroku-provided
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connectionString = configuration.GetConnectionString("DefaultConnection");
                }
                else
                {
                    // Use connection string provided at runtime by Heroku.
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // Parse connection URL to connection string for Npgsql
                    connUrl = connUrl.Replace("postgres://", string.Empty);
                    var pgUserPass = connUrl.Split("@")[0];
                    var pgHostPortDb = connUrl.Split("@")[1];
                    var pgHostPort = pgHostPortDb.Split("/")[0];
                    var pgDb = pgHostPortDb.Split("/")[1];
                    var pgUser = pgUserPass.Split(":")[0];
                    var pgPass = pgUserPass.Split(":")[1];
                    var pgHost = pgHostPort.Split(":")[0];
                    var pgPort = pgHostPort.Split(":")[1];

                    connectionString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;TrustServerCertificate=True";
                }

                // Whether the connection string came from the local development configuration file
                // or from the environment variable from Heroku, use it to set up your DbContext.
                options.UseNpgsql(connectionString);
            });

            return services;
        }
    }
}
