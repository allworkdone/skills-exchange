import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, location } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      location: location || '',
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const login = async (req: Request, res: Response): Promise<void> => {
 try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        rating: user.rating,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).populate('skills').populate('reviews');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
 } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};
