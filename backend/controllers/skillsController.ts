import { Request, Response } from 'express';
import { Skill } from '../models/Skill';
import { User } from '../models/User';
import { Types } from 'mongoose';
import { successResponse, errorResponse, sendResponse } from '../utils/response';

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
      sendResponse(res, errorResponse('Name, category, and description are required', 400));
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

    sendResponse(res, successResponse({ 
      message: 'Skill created successfully',
      skill,
    }, 'Skill created successfully', 201));
  } catch (error) {
    console.error('Create skill error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
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

    sendResponse(res, successResponse({ skills }, 'Skills retrieved successfully'));
  } catch (error) {
    console.error('Get skills error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
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

    sendResponse(res, successResponse({ skills }, 'User skills retrieved successfully'));
  } catch (error) {
    console.error('Get user skills error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
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
      sendResponse(res, errorResponse('Skill not found', 404));
      return;
    }

    if (skill.user.toString() !== (req as any).userId) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    skill.name = name || skill.name;
    skill.category = category || skill.category;
    skill.description = description || skill.description;
    skill.proficiencyLevel = proficiencyLevel || skill.proficiencyLevel;

    await skill.save();

    sendResponse(res, successResponse({ 
      message: 'Skill updated successfully',
      skill,
    }, 'Skill updated successfully'));
  } catch (error) {
    console.error('Update skill error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
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
      sendResponse(res, errorResponse('Skill not found', 404));
      return;
    }

    if (skill.user.toString() !== (req as any).userId) {
      sendResponse(res, errorResponse('Unauthorized', 403));
      return;
    }

    await Skill.deleteOne({ _id: skillId });

    const user = await User.findById((req as any).userId);
    if (user) {
      user.skills = user.skills.filter((id) => id.toString() !== skillId);
      await user.save();
    }

    sendResponse(res, successResponse({ message: 'Skill deleted successfully' }, 'Skill deleted successfully'));
 } catch (error) {
    console.error('Delete skill error:', error);
    sendResponse(res, errorResponse('Internal server error', 500));
 }
};
