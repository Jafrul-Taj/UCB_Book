using System;

namespace API.DTOs;

public class LoginDto
{
    public required string Email { get; set; }

    public required string password  { get; set; }
}
