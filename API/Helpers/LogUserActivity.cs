using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>(); 
            int id = resultContext.HttpContext.User.GetUserId();
            AppUser user = await unitOfWork.UserRepository.GetUserByIdAsync(id);
            user.LastActive = DateTime.UtcNow;

            await unitOfWork.Complete();

        }
    }
}
