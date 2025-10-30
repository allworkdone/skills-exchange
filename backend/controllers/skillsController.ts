import { Request, Response } from 'express';
import { Skill } from '../models/Skill';
import { User } from '../models/User';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
}

export const createSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, category, description, proficiencyLevel } = req.body;

    if (!name || !category || !description) {
      res.status(400).json({ error: 'Name, category, and description are required' });
      return;
    }

    const skill = new Skill({
      name,
      category,
      description,
      proficiencyLevel: proficiencyLevel || 'Beginner',
      user: (req as any).userId,
    });

    await skill.save();

    const user = await User.findById((req as any).userId);
    if (user) {
      user.skills.push(skill._id.toString());
      await user.save();
    }

    res.status(201).json({
      message: 'Skill created successfully',
      skill,
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    // Check for userId in both query parameters and route parameters
    const userId = req.query.userId || req.params.userId;

    const filter: any = {};
    if (category) filter.category = category;
    if (userId && typeof userId === 'string') {
      // Handle both string and ObjectId formats for user field
      try {
        filter.$or = [
          { user: userId },
          { user: new Types.ObjectId(userId) }
        ];
      } catch (error) {
        // If the userId is not a valid ObjectId format, just search for string match
        filter.user = userId;
      }
    }

    const skills = await Skill.find(filter).populate('user', 'firstName lastName profilePicture location');

    res.status(200).json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const getUserSkills = async (
 req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Handle both string and ObjectId formats for user field
    const userId = (req as any).userId;
    let skills;
    
    try {
      skills = await Skill.find({ 
        $or: [
          { user: userId },
          { user: new Types.ObjectId(userId) }
        ]
      });
    } catch (error) {
      // If the userId is not a valid ObjectId format, just search for string match
      skills = await Skill.find({ user: userId });
    }

    res.status(200).json(skills);
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const updateSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { skillId } = req.params;
    const { name, category, description, proficiencyLevel } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    if (skill.user.toString() !== (req as any).userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    skill.name = name || skill.name;
    skill.category = category || skill.category;
    skill.description = description || skill.description;
    skill.proficiencyLevel = proficiencyLevel || skill.proficiencyLevel;

    await skill.save();

    res.status(200).json({
      message: 'Skill updated successfully',
      skill,
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};

export const deleteSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { skillId } = req.params;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      res.status(404).json({ error: 'Skill not found' });
      return;
    }

    if (skill.user.toString() !== (req as any).userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    await Skill.deleteOne({ _id: skillId });

    const user = await User.findById((req as any).userId);
    if (user) {
      user.skills = user.skills.filter((id) => id.toString() !== skillId);
      await user.save();
    }

    res.status(200).json({ message: 'Skill deleted successfully' });
 } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
 }
};
