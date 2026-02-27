using System;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
    public string? RefrashToken { get; set; }
    public DateTime? RefrashTokenExpiry { get; set; }

    // Navigation Properties
    public Member Member { get; set; } = null!;
}
