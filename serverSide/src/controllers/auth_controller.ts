import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { IUser, User, googleDefaultPass } from '../models/user_model';

const client = new OAuth2Client();

const generateTokens = async (user: IUser) => {
  const { _id } = user;

  const accessToken = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  const refreshToken = jwt.sign({ _id }, process.env.JWT_REFRESH_SECRET);

  if (user.tokens == null) {
    user.tokens = [refreshToken];
  } else {
    user.tokens.push(refreshToken);
  }

  await user.save();
  return {
    accessToken,
    refreshToken,
  };
};

// Handle Google sign-in
const googleSignIn = async (req: Request, res: Response) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          password: googleDefaultPass,
          profile_image: picture,
        });
      }
      const token = await generateTokens(user);
      res.status(200).send({
        token,
        userId: user.id,
        isNeedPass: user.password === googleDefaultPass,
      });
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

// Register a new user
const register = async (req: Request, res: Response) => {
  const { name, email, password, profile_image } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send('missing email or password or name');
  }

  // Name validation
  const nameRegex = /^[a-zA-Z0-9\s]+$/;
  if (!nameRegex.test(name)) {
    return res.status(400).json({ error: 'Invalid name format' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Password validation
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    const rs = await User.findOne({ email });
    if (rs != null) {
      return res.status(406).send('email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const rs2 = await User.create({
      name,
      email,
      password: encryptedPassword,
      profile_image,
    });
    return res.status(201).send(rs2);
  } catch (error) {
    res.status(400).send('error');
  }
};

const login = async (req: Request, res: Response) => {
  console.log('login');
  const { password, email } = req.body;
  if (!email || !password) {
    return res.status(400).send('missing email or password');
  }
  try {
    const user = await User.findOne({ email });
    if (user == null) {
      return res.status(401).send('email or password incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('email or password incorrect');
    }

    const token = await generateTokens(user);
    return res.status(200).send({
      token,
      userId: user.id,
      isNeedPass: password === googleDefaultPass,
    });
  } catch (error) {
    res.status(400).send('error');
  }
};

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1];
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      console.log(err);
      if (err) {
        return res.sendStatus(401);
      }
      try {
        const userFromDb = await User.findOne({ _id: user._id });
        if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
          userFromDb.tokens = [];
          await userFromDb.save();
          return res.sendStatus(401);
        }
        userFromDb.tokens = userFromDb.tokens.filter(
          (token) => token !== refreshToken,
        );
        await userFromDb.save();
        return res.status(200);
      } catch (error) {
        res.sendStatus(401).send(error.message);
      }
    },
  );
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1];
  // console.log(refreshToken)
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        return res.sendStatus(403);
      }
      try {
        const userFromDb = await User.findOne({ _id: user._id });
        if (!userFromDb.tokens || !userFromDb.tokens.includes(refreshToken)) {
          userFromDb.tokens = []; // invalidates all user tokens
          await userFromDb.save();
          // return res.sendStatus(401)
        }

        // in case everything is fine
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION },
        );
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET,
        );

        userFromDb.tokens = userFromDb.tokens.filter(
          (token) => token !== refreshToken,
        );
        userFromDb.tokens.push(newRefreshToken);
        await userFromDb.save();
        // console.log(userFromDb)
        return res.status(200).send({
          accessToken,
          refreshToken: newRefreshToken,
        });
      } catch (error) {
        res.sendStatus(401).send(error.message);
      }
    },
  );
};

const checkToken = (req: Request, res: Response) => {
  const { token } = req.body;
  // console.log("from check",token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    return res.status(200).send(!err);
  });
};

export default {
  googleSignIn,
  register,
  login,
  logout,
  refresh,
  checkToken,
};
