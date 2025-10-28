import { IUser } from '../types/index';

export interface MatchResult {
  userId: string;
  matchScore: number;
  mutualSkills: Array<{
    userSkill: string;
    matchSkill: string;
  }>;
}

export const calculateMatchScore = (
  userSkills: Array<{ name: string; category: string }>,
  otherUserSkills: Array<{ name: string; category: string }>
): number => {
  let score = 0;
  const matchedSkills: Set<string> = new Set();

  for (const userSkill of userSkills) {
    for (const otherSkill of otherUserSkills) {
      if (
        userSkill.name.toLowerCase() === otherSkill.name.toLowerCase() ||
        userSkill.category === otherSkill.category
      ) {
        score += userSkill.name.toLowerCase() === otherSkill.name.toLowerCase() ? 30 : 10;
        matchedSkills.add(`${userSkill.name}-${otherSkill.name}`);
      }
    }
  }

  const baseScore = Math.min(score, 100);
  return baseScore;
};

export const findMatches = async (
  currentUser: any,
  allUsers: any[]
): Promise<MatchResult[]> => {
  const matches: MatchResult[] = [];

  const currentUserSkillNames = currentUser.skills.map((s: any) => ({
    name: s.name,
    category: s.category,
  }));

  for (const user of allUsers) {
    if (user._id.toString() === currentUser._id.toString()) {
      continue;
    }

    const userSkillNames = user.skills.map((s: any) => ({
      name: s.name,
      category: s.category,
    }));

    const matchScore = calculateMatchScore(currentUserSkillNames, userSkillNames);

    if (matchScore > 0) {
      const mutualSkills = currentUserSkillNames
        .filter((s: any) =>
          userSkillNames.some(
            (us: any) =>
              us.name.toLowerCase() === s.name.toLowerCase() ||
              us.category === s.category
          )
        )
        .map((s: any) => ({
          userSkill: s.name,
          matchSkill: userSkillNames.find(
            (us: any) =>
              us.name.toLowerCase() === s.name.toLowerCase() ||
              us.category === s.category
          )?.name || '',
        }));

      matches.push({
        userId: user._id.toString(),
        matchScore,
        mutualSkills,
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
};
