using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
                    .Where(x =>x.SourceMeberId == memberId)
                    .Select(x =>x.TaregtMemberId)
                    .ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likesParams.Predicate)
        {
            case "liked"   : result = query.Where(like =>like.SourceMeberId == likesParams.MemberId)
                                        .Select(like => like.TargetMember);
                                        break;
            case "likedBy" : result = query.Where(like => like.TaregtMemberId == likesParams.MemberId)
                                           .Select(like => like.SourceMember);
                                        break;
            default:        var likeIds = await GetCurrentMemberLikeIds(likesParams.MemberId);
                            result = query.Where(x => x.TaregtMemberId == likesParams.MemberId
                                        && likeIds.Contains(x.SourceMeberId))
                                        .Select(x => x.SourceMember);
                                        break;

        }

        return await PaginationHelper.CreateAsync(result, likesParams.PageNumber, likesParams.PageSize);
    }

    public async Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
    {
        var query = context.Likes.AsQueryable();

        switch (predicate)
        {
            case "liked"   : return await query.Where(x =>x.SourceMeberId == memberId)
                                         .Select(x => x.TargetMember)
                                         .ToListAsync();
            case "likedBy" : return await query.Where(x =>x.TaregtMemberId == memberId)
                                        .Select(x => x.SourceMember)
                                        .ToListAsync();
            default        : var likeIds = await GetCurrentMemberLikeIds(memberId);
                             return await query.Where(x => x.TaregtMemberId== memberId 
                                        && likeIds.Contains(x.SourceMeberId))
                                        .Select(x =>x.SourceMember)
                                        .ToListAsync();
        }
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync()>0;
    }
}
