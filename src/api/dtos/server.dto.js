class ServerDTO {
  id;
  name;
  description;
  icon;
  banner;
  createdAt;
  updatedAt;

  static from(data) {
    const serverDTO = new ServerDTO();
    serverDTO.id = data.id;
    serverDTO.name = data.name;
    serverDTO.description = data.description;
    serverDTO.icon = data.icon;
    serverDTO.banner = data.banner;
    serverDTO.createdAt = new Date();
    serverDTO.updatedAt = new Date();

    return serverDTO;
  }
}

export default ServerDTO;
