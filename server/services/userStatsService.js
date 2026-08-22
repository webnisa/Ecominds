import UserStats from "../models/UserStats.js";


// ==========================================
// GET OR CREATE USER STATS
// ==========================================

export const getOrCreateUserStats = async (
  userId
) => {

  let stats = await UserStats.findOne({
    userId,
  });


  if (!stats) {

    stats = await UserStats.create({
      userId,

      totalPoints: 0,

      currentStreak: 0,

      longestStreak: 0,

      totalCareActions: 0,

      badges: [],
    });
  }


  return stats;
};



// ==========================================
// ADD POINTS
// ==========================================

export const addUserPoints = async ({
  userId,
  points,
  streak,
}) => {

  const stats =
    await getOrCreateUserStats(
      userId
    );


  stats.totalPoints += points;

  stats.totalCareActions += 1;


  if (streak !== undefined) {

    stats.currentStreak =
      streak;


    if (
      streak >
      stats.longestStreak
    ) {

      stats.longestStreak =
        streak;
    }
  }


  stats.lastCareDate =
    new Date();


  // ==========================================
  // LEVEL SYSTEM
  // ==========================================

  stats.level =
    Math.floor(
      stats.totalPoints / 50
    ) + 1;


  // ==========================================
  // BADGES
  // ==========================================

  if (
    stats.currentStreak >= 7 &&
    !stats.badges.includes("7_day_streak")
  ) {

    stats.badges.push(
      "7_day_streak"
    );
  }


  if (
    stats.currentStreak >= 14 &&
    !stats.badges.includes("14_day_streak")
  ) {

    stats.badges.push(
      "14_day_streak"
    );
  }


  if (
    stats.currentStreak >= 30 &&
    !stats.badges.includes("30_day_streak")
  ) {

    stats.badges.push(
      "30_day_streak"
    );
  }


  await stats.save();


  return stats;
};