export type Message = {
  id: string
  senderId: string
  senderDisplayname: string
  senderImageUrl: string
  recipientId: string
  recipientDisplayname: string
  recipientImageUrl: string
  content: string
  dateRead?: string
  messageSent: string
  currentUserSender?: boolean
}
