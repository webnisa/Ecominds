import Points from "../models/Points.js";


// ==========================================
// GET START OF DAY
// ==========================================

const getDay = (date) => {

  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;
};


// ==========================================
// UPDATE CARE POINTS
// ==========================================

export const updateCarePoints = async (
  userId
) => {

  let points =
    await Points.findOne({
      userId,
    });


  // ==========================================
  // CREATE POINT PROFILE
  // ==========================================

  if (!points) {

    points =
      await Points.create({

        userId,

        totalPoints: 0,

        currentStreak: 0,

        longestStreak: 0,

      });

  }


  const today =
    getDay(new Date());


  // ==========================================
  // FIRST CARE
  // ==========================================

  if (!points.lastCareDate) {

    points.totalPoints += 1;

    points.currentStreak = 1;

    points.longestStreak = 1;

    points.lastCareDate = today;

    await points.save();

    return points;
  }


  const lastCare =
    getDay(
      points.lastCareDate
    );


  const difference =
    Math.floor(
      (
        today - lastCare
      ) /
      (1000 * 60 * 60 * 24)
    );


  // ==========================================
  // SAME DAY
  // ==========================================

  if (difference === 0) {

    return points;

  }


  // ==========================================
  // NEXT DAY
  // ==========================================

  if (difference === 1) {

    points.totalPoints += 1;

    points.currentStreak += 1;

    points.lastCareDate = today;


    // ==========================================
    // LONGEST STREAK
    // ==========================================

    if (
      points.currentStreak >
      points.longestStreak
    ) {

      points.longestStreak =
        points.currentStreak;

    }


    // ==========================================
    // 7 DAY BONUS
    // ==========================================

    if (
      points.currentStreak >= 7 &&
      !points.sevenDayBonusGiven
    ) {

      points.totalPoints += 10;

      points.sevenDayBonusGiven = true;

    }


    // ==========================================
    // 14 DAY BONUS
    // ==========================================

    if (
      points.currentStreak >= 14 &&
      !points.fourteenDayBonusGiven
    ) {

      points.totalPoints += 20;

      points.fourteenDayBonusGiven = true;

    }


    await points.save();

    return points;
  }


  // ==========================================
  // MISSED ONE OR MORE DAYS
  // ==========================================

  if (difference > 1) {

    // Lose 1 point for missed care

    points.totalPoints =
      Math.max(
        0,
        points.totalPoints - 1
      );


    // Reset streak

    points.currentStreak = 1;


    // New care day

    points.totalPoints += 1;

    points.lastCareDate = today;


    // Reset milestone bonuses
    points.sevenDayBonusGiven = false;

    points.fourteenDayBonusGiven = false;


    await points.save();

    return points;
  }


  return points;
};