﻿using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(
            UserManager<AppUser> userManager, RoleManager<AppRole> roleManager
        ) {
            if (await userManager.Users.AnyAsync()) return;

            string userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            List<AppUser> users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole { Name = "Admin" },
                new AppRole { Name = "Moderator" },
                new AppRole { Name = "Member" },
            };

            foreach(var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (AppUser user in users)
            {
                user.Photos.First().IsApproved = true;
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser() { UserName = "admin" };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}
