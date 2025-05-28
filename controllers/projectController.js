const { insertProjectData, getProjectsByClientId, getProjectsByClientAndDate, getProjectsForWeek, insertShiftRoleAssignments, countAssignedStaff, getRequiredCountByRoleId } = require('../config/dbops');
const { countRequiredShiftsByDay } = require('../helper/countRequiredShiftsByDay');
const { groupProjectsByClient } = require('../helper/groupProject');
const { groupShiftsByClient } = require('../helper/groupShiftsByClient');
const { groupShiftsByClientRequiredCount } = require('../helper/groupShiftsByClientRequiredCount');

const insertProjectController = async (req, res) => {
  const  projectData  = req.body;  


  try {
    const project = await insertProjectData(projectData);
    res.status(201).json({ message: 'Project data inserted successfully', data: project });
  } catch (error) {
    console.error('Error inserting project data:', error);
    res.status(500).json({ message: 'Error inserting project data', error: error.message });
  }
};


const getClientProjects = async (req, res) => {
  try {
    const { id } = req.params; // client_id

    const rawData = await getProjectsByClientId(id);

    if (!rawData || rawData.length === 0) {
      return res.status(200).json({ message: 'No projects found for this client.', data: [] });
    }

    const groupedData = groupProjectsByClient(rawData);

    return res.status(200).json({ data: groupedData });
  } catch (error) {
    console.error('Error fetching client projects:', error);
    return res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
};

const getClientProjectsByDate = async (req, res) => {
  try {
    const { id: clientId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const rawData = await getProjectsByClientAndDate(clientId, startDate, endDate);

    if (!rawData.length) {
      return res.json({ data: [] });
    }

  const grouped = groupProjectsByClient(rawData);
    res.json({ data: grouped });
  } catch (error) {
    console.error('Error fetching projects by date:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProjectsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    console.log(startDate,endDate)

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const rawData = await getProjectsForWeek( startDate, endDate);

    if (!rawData.length) {
      return res.json({ data: [] });
    }


  const groupedCount = countRequiredShiftsByDay(rawData);
  const groupedClient = groupShiftsByClientRequiredCount(rawData);
  const grouped = groupShiftsByClient(rawData);
    res.json({count: groupedCount, clients: groupedClient, shifts: grouped });
  } catch (error) {
    console.error('Error fetching projects by date:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
async function insertAssignment(req, res) {
  const assignments = req.body;

  if (!Array.isArray(assignments) || assignments.length === 0) {
    return res.status(400).json({ error: 'Assignments array is required' });
  }

  // Validate each assignment object has required fields
  for (const assignment of assignments) {
    if (!assignment.project_shift_role_id || !assignment.staff_id) {
      return res.status(400).json({ error: 'Each assignment requires project_shift_role_id and staff_id' });
    }
  }

  try {
    // Group assignments by project_shift_role_id
    const grouped = assignments.reduce((acc, assignment) => {
      const roleId = assignment.project_shift_role_id;
      if (!acc[roleId]) acc[roleId] = [];
      acc[roleId].push(assignment);
      return acc;
    }, {});

    // For each project_shift_role_id, check counts
    for (const [roleId, groupAssignments] of Object.entries(grouped)) {
      const assignCount = await countAssignedStaff(roleId);
      const requiredCount = await getRequiredCountByRoleId(roleId);

      if (assignCount >= requiredCount) {
        return res.status(400).json({ error: `Cannot assign more staff than required for shift role ${roleId}` });
      }

      if (groupAssignments.length > (requiredCount - assignCount)) {
        return res.status(400).json({ error: `Cannot assign more than ${requiredCount - assignCount} staff for shift role ${roleId}` });
      }
    }

    // All validations passed - insert all assignments
    const inserted = await insertShiftRoleAssignments(assignments);
    return res.status(201).json(inserted);
  } catch (error) {
    console.error('Error inserting assignment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { insertAssignment, getProjectsByDate, getClientProjectsByDate, getClientProjects, insertProjectController };
