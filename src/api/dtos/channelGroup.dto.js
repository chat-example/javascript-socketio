
import ChannelDTO from './channel.dto';
class ChannelGroupDTO {
  id
  name
  description
  updatedAt
  createdAt
  serverId
  channels

  static from({ id, name, description, updatedAt, createdAt, serverId, channels }) {
    const dto = new ChannelGroupDTO();

    dto.id = id;
    dto.name = name;
    dto.description = description;
    dto.updatedAt = updatedAt;
    dto.createdAt = createdAt;
    dto.serverId = serverId;

    if (Array.isArray(channels) && channels.length > 0) {
      dto.channels = channels.map(ChannelDTO.from);
    }

    return dto;
  }
}

export default ChannelGroupDTO;
