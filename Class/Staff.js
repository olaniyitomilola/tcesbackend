class Staff {
  constructor({
    id,
    first_name,
    last_name,
    role,
    email,
    phone,
    nin,
    address,
    is_driver = false,
    license_number = '',
    has_pts = false,
    pts_number = '',
    ticket_coss = false,
    ticket_es = false,
    ticket_mc = false,
    ticket_points = false,
    ticket_lxa = false,
    ticket_dumper = false,
    ticket_roller = false,
    ticket_small_tools = false,
    ticket_hand_trolley = false,
    available_monday = false,
    available_tuesday = false,
    available_wednesday = false,
    available_thursday = false,
    available_friday = false,
    available_saturday = false,
    available_sunday = false,
    jobtype_civils = false,
    jobtype_surveying = false,
    jobtype_hbe = false,
    jobtype_management = false,
    employment_type,
    is_activated = false,
  }) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.role = role;
    this.email = email;
    this.phone = phone;
    this.nin = nin;
    this.address = address;
    this.is_driver = is_driver;
    this.license_number = license_number;
    this.has_pts = has_pts;
    this.pts_number = pts_number;

    this.tickets = {
      coss: ticket_coss,
      es: ticket_es,
      mc: ticket_mc,
      points: ticket_points,
      lxa: ticket_lxa,
      dumper: ticket_dumper,
      roller: ticket_roller,
      small_tools: ticket_small_tools,
      hand_trolley: ticket_hand_trolley
    };

    this.availability = {
      monday: available_monday,
      tuesday: available_tuesday,
      wednesday: available_wednesday,
      thursday: available_thursday,
      friday: available_friday,
      saturday: available_saturday,
      sunday: available_sunday
    };

    this.job_types = {
      civils: jobtype_civils,
      surveying: jobtype_surveying,
      hbe: jobtype_hbe,
      management: jobtype_management
    };

    this.employment_type = employment_type;
    this.is_activated = is_activated;
  }
}

module.exports = { Staff };
