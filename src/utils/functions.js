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

export function authByToken(req,res,next, callback) {
  this.logger.debug('[authWithToken] user jwt sign in start');
  passport.authenticate('jwt', (passportError, user, info) => {
    if (passportError || !user) {
      res.status(StatusCodes.BAD_REQUEST).json(info);
      return;
    }
    this.logger.debug(`[authWithToken] user jwt sign in success ${user.id}`);

    callback(user);
  })(req, res, next);
}
