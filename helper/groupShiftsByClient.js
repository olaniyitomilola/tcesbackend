function groupShiftsByClient(data) {
    const result = {};
  
    data.forEach(shift => {
      const { client_name, location, shift_date, ...rest } = shift;
  
      if (!result[client_name]) {
        result[client_name] = [];
      }
  
      // Find or create location group
      let locationGroup = result[client_name].find(entry => entry.location === location);
      if (!locationGroup) {
        locationGroup = { location, shifts: {} };
        result[client_name].push(locationGroup);
      }
  
      const dateKey = new Date(shift_date).toISOString().split("T")[0];
  
      if (!locationGroup.shifts[dateKey]) {
        locationGroup.shifts[dateKey] = [];
      }
  
      locationGroup.shifts[dateKey].push({
        ...rest,
        shift_date: dateKey
      });
    });
  
    return result;
  }

  
  module.exports = { groupShiftsByClient };