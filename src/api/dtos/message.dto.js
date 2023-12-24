class MessageDTO {
  id
  content
  updatedAt
  createdAt
  authorId

  static from({ id, content, updatedAt, createdAt, authorId }) {
    const dto = new MessageDTO();

    dto.id = id;
    dto.content = content;
    dto.updatedAt = updatedAt;
    dto.createdAt = createdAt;
    dto.authorId = authorId;

    return dto;
  }
}

export default MessageDTO;
