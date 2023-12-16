import {Strategy as StrategyJWT } from 'passport-jwt';
import { Strategy as StrategyLocal} from 'passport-local';
import userService from '../services/user.service.js';

const localStrategy = new StrategyLocal({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
}, async (email, password, done) => {
  try {
    const user = await userService.signInByEmail({ email, password });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

const jwtStrategy = new StrategyJWT({
  jwtFromRequest: (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['accessToken'];
    }
    return token;
  },
  secretOrKey: process.env.JWT_SECRET,
}, async (jwtPayload, done) => {
  try {
    const user = await userService.getUserById({ id: jwtPayload.id });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default function passportConfig(passport) {
  passport.use('local', localStrategy);
  passport.use('jwt', jwtStrategy);
};
