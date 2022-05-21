using System;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dateBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateBirth.Year;

            if (dateBirth.Date > today.AddYears(-age)) 
            { 
                age--; 
            }
            return age;
        }
    }
}
