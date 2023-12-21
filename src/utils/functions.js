import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import passport from 'passport';
    
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
  passport.authenticate('jwt', (passportError, user, info) => {
    if (passportError) {
      res.status(StatusCodes.BAD_REQUEST).json(passportError);
      return;
    }

    if (!user) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'no user found'
      });
      return;
    }

    callback(user);
  })(req, res, next);
}
