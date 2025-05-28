const { sql } = require("./db");


const fetchVehiclebyReg = async (reg) => {
    const vehicle = await sql`
    SELECT * FROM vehicles WHERE registration = ${reg.trim().toUpperCase()} AND is_deleted = false
`;
  
return vehicle;
}


const fetchVehiclebyId = async (reg) => {
    const vehicle = await sql`
    SELECT * FROM vehicles WHERE id = ${id} AND is_deleted = false
`;
  
return vehicle;
}

const fetchVehicles = async () => {
    const vehicles = await sql`
    SELECT * FROM vehicles WHERE is_deleted = false`;
  
    return (vehicles);
}
const insertVehicle = async (vehicle)=>{
    await sql`
    INSERT INTO vehicles (
        name, fuel_type, mot_test, tax, tax_expiry, mot_expiry, registration, recall,last_mileage
    ) VALUES (
        ${vehicle.name},
        ${vehicle.fuelType},
        ${vehicle.motTest},
        ${vehicle.tax},
        ${vehicle.taxExpiry},
        ${vehicle.motExpiry},
        ${vehicle.registration.trim().toUpperCase()},
        ${vehicle.recall},
        ${vehicle.last_mileage}
    )
`;
}


const softDeleteVehicle = async (id) => {
    const result = await sql`
        UPDATE vehicles SET is_deleted = true WHERE id = ${id}
    `;
    return result;
};


const reAddsoftDeletedVehicle = async (id) => {
    const result = await sql`
        UPDATE vehicles SET is_deleted = false WHERE id = ${id}
    `;
    return result;
};

const vanIssues = async (vanId) => {
    try {
        const issues = await sql`
            SELECT 
                vi.id AS issue_id,
                COALESCE(s.first_name || ' ' || s.last_name, 'Deleted User') AS reported_by,
                vi.description,
                vi.fixed,
                vi.created_at,
                vi.updated_at
            FROM van_issues vi
            LEFT JOIN staff s ON vi.driver_id = s.id
            WHERE vi.van_id = ${vanId}
            ORDER BY vi.created_at DESC;
        `;

        return issues;
    } catch (error) {
        console.error('Error fetching van issues:', error);
        throw error;
    }
};
const fixVanIssue = async (issueId) => {
    try {
        const result = await sql`
            UPDATE van_issues
            SET fixed = true,
                updated_at = NOW()
            WHERE id = ${issueId}
            RETURNING *;
        `;

        return result[0];  // return the updated issue (or undefined if not found)
    } catch (error) {
        console.error('Error fixing van issue:', error);
        throw error;
    }
};

const createVanIssue = async (driverId, vanId, description) => {
    try {
        const newIssue = await sql`
            INSERT INTO van_issues (driver_id, van_id, description, fixed, created_at, updated_at)
            VALUES (${driverId}, ${vanId}, ${description}, false, NOW(), NOW())
            RETURNING *;
        `;

        return newIssue[0];  // return the newly created issue
    } catch (error) {
        console.error('Error creating van issue:', error);
        throw error;
    }
};

const getDriverHistoryByVan = async (vanId) => {
    const history = await sql`
      SELECT 
        dh.id,
        dh.pickup_date,
        dh.dropoff_date,
        s.first_name || ' ' || s.last_name AS driver_name
      FROM driver_history dh
      LEFT JOIN staff s ON dh.driver_id = s.id
      WHERE dh.van_id = ${vanId}
      ORDER BY 
        dh.dropoff_date IS NULL DESC,  -- NULLs first
        dh.dropoff_date DESC;          -- then newest first
    `;
  
    return history;
};
const addDriverHistory = async (driverId, vanId) => {
    return await sql`
      INSERT INTO driver_history (
        driver_id,
        van_id,
        pickup_date
      ) VALUES (
        ${driverId},
        ${vanId},
        CURRENT_DATE
      ) RETURNING *;
    `;
  };
  const returnVan = async (driverId, vanId) => {
    return await sql`
      UPDATE driver_history
      SET dropoff_date = CURRENT_DATE
      WHERE driver_id = ${driverId}
        AND van_id = ${vanId}
        AND dropoff_date IS NULL
      RETURNING *;
    `;
  };
  
  const insertStaff = async ({
    first_name, last_name, role, email, phone, nin, address,
    is_driver, license_number, has_pts, pts_number,
    ticket_coss, ticket_es, ticket_mc,
    ticket_ss, ticket_points, ticket_lxa, ticket_dumper, ticket_roller, ticket_small_tools, ticket_hand_trolley,
    available_monday, available_tuesday, available_wednesday,
    available_thursday, available_friday, available_saturday, available_sunday,
    jobtype_civils, jobtype_surveying, jobtype_hbe, jobtype_management,
    employment_type, is_activated
  }) => {
    const result = await sql`
      INSERT INTO staff (
        first_name, last_name, role, email, phone, nin, address,
        is_driver, license_number, has_pts, pts_number,
        ticket_coss, ticket_es, ticket_mc,
        ticket_points, ticket_lxa, ticket_dumper, ticket_roller, ticket_small_tools, ticket_hand_trolley,
        available_monday, available_tuesday, available_wednesday,
        available_thursday, available_friday, available_saturday, available_sunday,
        jobtype_civils, jobtype_surveying, jobtype_hbe, jobtype_management,
        employment_type, is_activated
      ) VALUES (
        ${first_name}, ${last_name}, ${role}, ${email}, ${phone}, ${nin}, ${address},
        ${is_driver}, ${license_number}, ${has_pts}, ${pts_number},
        ${ticket_coss}, ${ticket_es}, ${ticket_mc},
        ${ticket_points}, ${ticket_lxa}, ${ticket_dumper}, ${ticket_roller}, ${ticket_small_tools}, ${ticket_hand_trolley},
        ${available_monday}, ${available_tuesday}, ${available_wednesday},
        ${available_thursday}, ${available_friday}, ${available_saturday}, ${available_sunday},
        ${jobtype_civils}, ${jobtype_surveying}, ${jobtype_hbe}, ${jobtype_management},
        ${employment_type}, ${is_activated}
      )
      RETURNING *;
    `;
  
    return result[0];
  };
  

  const getUserByEmail = async (email) => {
    const result = await sql`
      SELECT * FROM staff WHERE email = ${email} AND is_deleted=false
    `;
  
    return result.length > 0 ? result[0] : null;
};
const getUserById = async (id) => {
    const result = await sql`
      SELECT * FROM staff WHERE id = ${id} AND is_deleted=false
    `;
  
    return result.length > 0 ? result[0] : null;
};
const updateUserPasswordById = async (id, hashedPassword) => {
    const result = await sql`
      UPDATE staff
      SET password = ${hashedPassword}, is_activated = true
      WHERE id = ${id}
      RETURNING *;
    `;
  
    return result.length > 0 ? result[0] : null;
  };
  const getAllUsers = async () => {
    const result = await sql`
      SELECT 
        id, first_name, last_name, role, email, phone, nin, address,
        is_driver, license_number, has_pts, pts_number,
        ticket_coss, ticket_es, ticket_mc, ticket_points,ticket_lxa,ticket_dumper,ticket_roller,ticket_small_tools,ticket_hand_trolley,
        available_monday, available_tuesday, available_wednesday,
        available_thursday, available_friday, available_saturday, available_sunday,
        jobtype_civils, jobtype_surveying, jobtype_hbe, jobtype_management,
        employment_type, is_activated
      FROM staff
      WHERE is_deleted = false
    `;
    return result;
  };

  const updateUserById = async (id, updates) => {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
  
    if (fields.length === 0) return null;
  
    const assignments = fields.map((field, index) => sql`${sql(field)} = ${values[index]}`);
  
    const result = await sql`
      UPDATE staff
      SET ${sql.join(assignments, sql`, `)}
      WHERE id = ${id}
      RETURNING *;
    `;
  
    return result.length > 0 ? result[0] : null;
  };
  
  const getAllGarages = async () => {
    const result = await sql`
      SELECT * FROM garage
      ORDER BY name;
    `;
    return result;
  };

  const addGarage = async ({ name, address, phone }) => {
    const result = await sql`
      INSERT INTO garage (name, address, phone)
      VALUES (${name}, ${address}, ${phone})
      RETURNING *;
    `;
    return result[0];
  };
  
  const bookGarageAppointment = async ({
    van_id,
    garage_id,
    service,
    appointment_date,
    appointment_time
  }) => {
    const result = await sql`
      INSERT INTO garage_appointments (
        van_id, garage_id, service, appointment_date, appointment_time
      ) VALUES (
        ${van_id}, ${garage_id}, ${service}, ${appointment_date}, ${appointment_time}
      )
      RETURNING *;
    `;
    return result[0];
  };
  const getAllGarageAppointments = async () => {
    const result = await sql`
      SELECT 
        ga.id,
        ga.service,
        ga.appointment_date,
        ga.appointment_time,
        g.name AS garage_name,
        g.address AS garage_location,
        g.phone AS garage_contact,
        v.registration AS van_registration
      FROM garage_appointments ga
      JOIN garage g ON ga.garage_id = g.id
      JOIN vehicles v ON ga.van_id = v.id
      ORDER BY ga.appointment_date DESC, ga.appointment_time DESC;
    `;
    return result;
  };

  const getGarageAppointments = async (id) => {
    const result = await sql`
      SELECT 
        ga.id,
        ga.service,
        ga.appointment_date,
        ga.appointment_time,
        g.name AS garage_name,
        g.address AS garage_location,
        g.phone AS garage_contact,
        v.registration AS van_registration
      FROM garage_appointments ga
      JOIN garage g ON ga.garage_id = g.id
      JOIN vehicles v ON ga.van_id = v.id
      WHERE ga.garage_id = ${id}
      ORDER BY ga.appointment_date DESC, ga.appointment_time DESC;
    `;
    return result;
  };
  const createClient = async (name) => {
    const result = await sql`
      INSERT INTO clients (name)
      VALUES (${name})
      RETURNING *;
    `;
    return result[0];
  };
  const getAllClients = async () => {
    const result = await sql`
      SELECT * FROM clients
      WHERE is_deleted = false
      ORDER BY created_at DESC;
    `;
    return result;
  };
  
  const insertProjectData = async (projectData) => {
  
    return await sql.begin(async (tx) => {
      // Step 1: Insert the project into the projects table
      const [project] = await tx`
        INSERT INTO projects (client_id, location)
        VALUES (${projectData[0].client_id}, ${projectData[0].location})
        RETURNING id;
      `;
  
      // Step 2: Insert shifts for each project
      for (const shiftData of projectData) {
        const { start_date, end_date, start_time, end_time, roles } = shiftData;
  
        // Insert the shift into the project_shifts table
        const [projectShift] = await tx`
          INSERT INTO project_shifts (
            project_id, shift_date, start_time, end_time
          ) VALUES (
            ${project.id}, ${start_date}, ${start_time}, ${end_time}
          ) RETURNING id;
        `;
  
        // Step 3: Insert roles for each shift
        for (const role of roles) {
          const jobTypes = role.jobTypes || {};
          const tickets = role.tickets || {};
       
  
          await tx`
            INSERT INTO project_shift_roles (
              project_shift_id,
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
            )
            VALUES (
              ${projectShift.id},
              ${role.role},
              ${role.count},
              ${jobTypes.Civils || false},
              ${jobTypes.Surveying || false},
              ${jobTypes.HBE || false},
              ${jobTypes.Management || false},
              ${tickets.COSS || false},
              ${tickets.ES || false},
              ${tickets.MC || false},
              ${tickets.LXA || false},
              ${tickets.Dumper || false},
              ${tickets.Roller || false},
              ${tickets.Small_Tools || false},
              ${tickets.Hand_Trolley || false},
              ${tickets.Points || false}
            );
          `;
        }
      }
  
      return project;
    });
  };
  

const getProjectsByClientId = async (clientId) => {
  const result = await sql`
    SELECT 
      p.id AS project_id,
      p.client_id,
      p.location,
      ps.id AS shift_id,
      ps.shift_date,
      ps.start_time,
      ps.end_time,
      pr.role,
      pr.required_count,
      pr.jobtype_civils,
      pr.jobtype_surveying,
      pr.jobtype_hbe,
      pr.jobtype_management,
      pr.ticket_coss,
      pr.ticket_es,
      pr.ticket_mc,
      pr.ticket_lxa,
      pr.ticket_dumper,
      pr.ticket_roller,
      pr.ticket_small_tools,
      pr.ticket_hand_trolley,
      pr.ticket_points
    FROM projects p
    JOIN project_shifts ps ON p.id = ps.project_id
    JOIN project_shift_roles pr ON ps.id = pr.project_shift_id
    WHERE p.client_id = ${clientId}
    ORDER BY p.id, ps.shift_date, ps.start_time;
  `;

  return result;
};

const getProjectsByClientAndDate = async (clientId, startDate, endDate) => {
  const result = await sql`
    SELECT 
      p.id AS project_id,
      p.client_id,
      p.location,
      ps.id AS shift_id,
      ps.shift_date,
      ps.start_time,
      ps.end_time,
      r.role,
      r.required_count,
      r.jobtype_civils,
      r.jobtype_surveying,
      r.jobtype_hbe,
      r.jobtype_management,
      r.ticket_coss,
      r.ticket_es,
      r.ticket_mc,
      r.ticket_lxa,
      r.ticket_dumper,
      r.ticket_roller,
      r.ticket_small_tools,
      r.ticket_hand_trolley,
      r.ticket_points
    FROM projects p
    JOIN project_shifts ps ON ps.project_id = p.id
    JOIN project_shift_roles r ON r.project_shift_id = ps.id
    WHERE p.client_id = ${clientId}
      AND ps.shift_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY p.id, ps.shift_date, ps.start_time;
  `;
  return result;
};


const getProjectsForWeek = async ( startDate, endDate) => {
  const result = await sql`
    SELECT 
      p.id AS project_id,
      p.client_id,
      cn.name AS client_name,
      p.location,
      ps.id AS shift_id,
      ps.shift_date,
      ps.start_time,
      ps.end_time,
      pr.role,
      pr.required_count,
      pr.jobtype_civils,
      pr.jobtype_surveying,
      pr.jobtype_hbe,
      pr.jobtype_management,
      pr.ticket_coss,
      pr.ticket_es,
      pr.ticket_mc,
      pr.ticket_lxa,
      pr.ticket_dumper,
      pr.ticket_roller,
      pr.ticket_small_tools,
      pr.ticket_hand_trolley,
      pr.ticket_points
    FROM projects p
    JOIN project_shifts ps ON p.id = ps.project_id
    JOIN clients cn ON cn.id = p.client_id
    JOIN project_shift_roles pr ON ps.id = pr.project_shift_id
    WHERE ps.shift_date BETWEEN ${startDate} AND ${endDate}
    ORDER BY ps.shift_date;

  `;
  return result;
};


async function insertShiftRoleAssignments(assignments) {
  if (!Array.isArray(assignments) || assignments.length === 0) return;

  try {
    const result = await sql`
      INSERT INTO project_shift_role_assignments ${
        sql(assignments.map(a => ({
          project_shift_role_id: a.project_shift_role_id,
          staff_id: a.staff_id,
          notes: a.notes || null
        })))
      }
      RETURNING *;
    `;
    return result;
  } catch (err) {
    console.error('Error inserting assignments:', err);
    throw err;
  }
}

async function updateShiftRoleAssignment({ assignmentId, newStaffId, notes }) {
  try {
    const result = await sql`
      UPDATE project_shift_role_assignments
      SET
        staff_id = ${newStaffId},
        notes = ${notes || null},
        assigned_at = now()
      WHERE id = ${assignmentId}
      RETURNING *;
    `;
    return result[0]; // Return the updated row
  } catch (err) {
    console.error('Error updating assignment:', err);
    throw err;
  }
}

async function countAssignedStaff(projectShiftRoleId) {
  try {
    const result = await sql`
      SELECT COUNT(*)::int AS count
      FROM project_shift_role_assignments
      WHERE project_shift_role_id = ${projectShiftRoleId};
    `;
    return result[0].count;
  } catch (err) {
    console.error('Error counting assignments:', err);
    throw err;
  }
}

async function deleteAssignment(assignmentId) {
  try {
    await sql`
      DELETE FROM project_shift_role_assignments
      WHERE id = ${assignmentId};
    `;
    console.log(`Assignment ${assignmentId} deleted successfully.`);
  } catch (err) {
    console.error('Error deleting assignment:', err);
    throw err;
  }
}

async function getRequiredCountByRoleId(project_shift_role_id) {
  const [result] = await sql`
    SELECT required_count 
    FROM project_shift_roles
    WHERE id = ${project_shift_role_id}
  `;
  return result ? result.required_count : null;
}

module.exports = {getRequiredCountByRoleId, deleteAssignment, countAssignedStaff, updateShiftRoleAssignment, insertShiftRoleAssignments, getProjectsForWeek, getProjectsByClientAndDate, getProjectsByClientId, insertProjectData, getAllClients, createClient, getGarageAppointments, getAllGarageAppointments, bookGarageAppointment, addGarage, getAllGarages, updateUserById, getAllUsers,  getUserById, updateUserPasswordById, getUserByEmail, insertStaff, returnVan, addDriverHistory,getDriverHistoryByVan,fetchVehiclebyReg,fetchVehicles, insertVehicle,softDeleteVehicle,reAddsoftDeletedVehicle, fetchVehiclebyId, vanIssues, fixVanIssue, createVanIssue}
