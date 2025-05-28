function groupProjectsByClient(data) {
    if (!data || data.length === 0) return [];
  
    const projectsMap = new Map();
  
    for (const row of data) {
      const {
        project_id,
        client_id,
        location,
        shift_id,
        shift_date,
        start_time,
        end_time,
        role,
        required_count,
        jobtype_civils,
        jobtype_surveying,
        jobtype_hbe,
        jobtype_management,
        ticket_coss,
        ticket_es,
        ticket_mc,
        ticket_lxa,
        ticket_dumper,
        ticket_roller,
        ticket_small_tools,
        ticket_hand_trolley,
        ticket_points
      } = row;
  
      if (!projectsMap.has(project_id)) {
        projectsMap.set(project_id, {
          project_id,
          client_id,
          location,
          shifts: {}
        });
      }
  
      const project = projectsMap.get(project_id);
      const shiftDateKey = new Date(shift_date).toISOString().split('T')[0];
  
      if (!project.shifts[shiftDateKey]) {
        project.shifts[shiftDateKey] = [];
      }
  
      // Check if shift with same time already exists on that date
      let timeBlock = project.shifts[shiftDateKey].find(
        (s) => s.start_time === start_time && s.end_time === end_time
      );
  
      if (!timeBlock) {
        timeBlock = {
          start_time,
          end_time,
          roles: []
        };
        project.shifts[shiftDateKey].push(timeBlock);
      }
  
      // Add role to that time block
      timeBlock.roles.push({
        role,
        required_count,
        jobTypes: {
          Civils: jobtype_civils,
          Surveying: jobtype_surveying,
          HBE: jobtype_hbe,
          Management: jobtype_management
        },
        tickets: {
          COSS: ticket_coss,
          ES: ticket_es,
          MC: ticket_mc,
          LXA: ticket_lxa,
          Dumper: ticket_dumper,
          Roller: ticket_roller,
          Small_Tools: ticket_small_tools,
          Hand_Trolley: ticket_hand_trolley,
          Points: ticket_points
        }
      });
    }
  
    return Array.from(projectsMap.values());
  }
  

  module.exports = {groupProjectsByClient}