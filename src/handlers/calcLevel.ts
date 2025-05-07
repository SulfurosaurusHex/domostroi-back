const XP_BASE = 100;

export const calcXpPerLevel = (level: number) => XP_BASE * Math.pow(level, 2);
export const calcLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100));
