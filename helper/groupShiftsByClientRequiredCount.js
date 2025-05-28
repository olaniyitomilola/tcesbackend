 function groupShiftsByClientRequiredCount(data) {
    const result = {};
  
    data.forEach(shift => {
      const { client_name, required_count } = shift;
  
      if (!result[client_name]) {
        result[client_name] = 0;
      }
  
      result[client_name] += required_count || 0;
    });
  
    return Object.entries(result).map(([client, shifts]) => ({
      client,
      shifts
    }));
  }
  module.exports = {groupShiftsByClientRequiredCount}