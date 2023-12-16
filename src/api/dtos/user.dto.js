class UserDTO {
  id
  email
  password
  salt

  nickname
  createdAt
  updatedAt

  static from(data) {
    const user = new UserDTO();

    Object.assign(user, data);

    return user;
  }
}

export default UserDTO;
