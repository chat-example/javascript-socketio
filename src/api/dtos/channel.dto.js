class ChannelDTO {
  id
  name
  description
  updatedAt
  createdAt
  channelGroupId

  static from({ id, name, description, updatedAt, createdAt, channelGroupId }) {
    const dto = new ChannelDTO();

    dto.id = id;
    dto.name = name;
    dto.description = description;
    dto.updatedAt = updatedAt;
    dto.createdAt = createdAt;
    dto.channelGroupId = channelGroupId;

    return dto;
  }
}