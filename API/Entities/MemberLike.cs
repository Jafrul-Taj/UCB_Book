using System;

namespace API.Entities;

public class MemberLike
{
    public required string SourceMeberId { get; set; }
    public Member SourceMember { get; set; } = null!;

    public required string TaregtMemberId { get; set; }

    public Member TargetMember { get; set; } = null!;
}
