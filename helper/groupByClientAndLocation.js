function groupByClientAndLocation(data) {
    return data.reduce((acc, item) => {
      // Find or create client group
      let clientGroup = acc.find(c => c.client_id === item.client_id);
      if (!clientGroup) {
        clientGroup = {
          client_name: item.client_name || "",
          client_id: item.client_id,
          locations: []
        };
        acc.push(clientGroup);
      }
  
      // Find or create location group
      let locationGroup = clientGroup.locations.find(l => l.location === item.location);
      if (!locationGroup) {
        locationGroup = {
          location: item.location,
          projects: []
        };
        clientGroup.locations.push(locationGroup);
      }
  
      // Find or create project
      let project = locationGroup.projects.find(p => p.project_id === item.project_id);
      if (!project) {
        project = {
          project_id: item.project_id,
          shifts: {}
        };
        locationGroup.projects.push(project);
      }
  
      // Merge shifts
      for (const [date, shiftsArray] of Object.entries(item.shifts)) {
        if (!project.shifts[date]) {
          project.shifts[date] = shiftsArray;
        } else {
          project.shifts[date].push(...shiftsArray);
        }
      }
  
      return acc;
    }, []);
}
  
  module.exports = {groupByClientAndLocation}