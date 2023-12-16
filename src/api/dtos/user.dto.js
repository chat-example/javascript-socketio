class UserDTO {
  id
  email
  nickname
  createdAt
  updatedAt

  static from(data) {
    const user = new UserDTO();

    user.id = data.id;
    user.email = data.email;
    user.nickname = data.nickname;
    user.createdAt = data.createdAt;
    user.updatedAt = data.updatedAt;

    return user;
  }
}

export default UserDTO;
