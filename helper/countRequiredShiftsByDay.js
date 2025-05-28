function countRequiredShiftsByDay(data) {
    if (!data || data.length === 0) {
      return {
        total: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
      };
    }
  
    const dayCounts = {
      total: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };
  
    for (const entry of data) {
      const date = new Date(entry.shift_date);
      const dayIndex = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
      const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayMap[dayIndex];
  
      const requiredCount = parseInt(entry.required_count, 10) || 0;
      dayCounts[dayName] += requiredCount;
      dayCounts.total += requiredCount;
    }
  
    return dayCounts;
  }


module.exports = {countRequiredShiftsByDay}