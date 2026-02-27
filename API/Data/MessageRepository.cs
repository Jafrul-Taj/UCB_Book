using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams 
                                                                            messageParams)
    {
        var query = context.Messages
            .OrderByDescending(m => m.MessageSent)
            .AsQueryable();
            
        query = messageParams.Container switch
        {
            // "Inbox" => query.Where(u => u.RecipientId == messageParams.MemberId 
            //                             && u.RecipientDeleted == false),
            "Outbox" => query.Where(u => u.SenderId == messageParams.MemberId 
                            && u.SenderDeleted == false),
            _ => query.Where(u => u.RecipientId == messageParams.MemberId 
                        && u.RecipientDeleted == false)
        };

        var messagesQuery = query.Select(MessageExtensions.ToDtoProjection());

        return await PaginationHelper.CreateAsync(messagesQuery, messageParams.PageNumber, 
                        messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentUserId, string recipientUserId)
    {
        await context.Messages
            .Where(x => x.RecipientId == currentUserId && x.SenderId == recipientUserId 
                        && x.DateRead == null)
            .ExecuteUpdateAsync(setter => setter
                    .SetProperty(m => m.DateRead, DateTime.UtcNow));
            

        return await context.Messages
            .Where(m => (m.RecipientId == currentUserId && m.RecipientDeleted == false 
                        && m.SenderId == recipientUserId) 
                    || (m.SenderId == currentUserId && m.SenderDeleted == false 
                        && m.RecipientId == recipientUserId))
            .OrderBy(m => m.MessageSent)
            .Select(MessageExtensions.ToDtoProjection())
            .ToListAsync();
        
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
