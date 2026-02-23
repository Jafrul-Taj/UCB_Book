using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessageRepository
{
    void AddMessage(Message message);
    void DeleteMessage(Message message);
    Task<Message?> GetMessage(int messageId);
    Task<PaginatedResult<MessageDto>> GetMessagesForMember();
    Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentUserId, string recipientUserId);
    Task<bool> SaveAllAsync();
}

