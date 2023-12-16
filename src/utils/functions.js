import bcrypt from 'bcrypt';
    
export async function hashString(password, salt) {
  if (!salt) {
    salt = await bcrypt.genSalt(10);
  }

  return {
    hash: await bcrypt.hash(password, salt),
    salt,
  };
}
