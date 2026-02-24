using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;

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

    public async Task<Message?> GetMessage(int messageId)
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
            "Outbox" => query.Where(u => u.SenderId == messageParams.MemberId),
            _ => query.Where(u => u.RecipientId == messageParams.MemberId )
        };

        var messagesQuery = query.Select(MessageExtensions.ToDtoProjection());

        return await PaginationHelper.CreateAsync(messagesQuery, messageParams.PageNumber, 
                        messageParams.PageSize);
    }

    public Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentUserId, string recipientUserId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
