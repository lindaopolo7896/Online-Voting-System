export const mockData = {
  organizations: [
    {
      organization_id: 1,
      organization_name: "University of Nairobi",
      organization_type: "Academic Institution",
      description: "Public University",
      status: "active",
    },
    {
      organization_id: 2,
      organization_name: "St Peter Church",
      organization_type: "Church",
      description: "Religious organization",
      status: "active",
    },
  ],

  organizationUnits: [
    {
      unit_id: 1,
      organization_id: 1,
      unit_name: "Computer Science Department",
      unit_type: "Department",
    },
    {
      unit_id: 2,
      organization_id: 1,
      unit_name: "Business Faculty",
      unit_type: "Faculty",
    },
    {
      unit_id: 3,
      organization_id: 2,
      unit_name: "Youth Ministry",
      unit_type: "Ministry",
    },
  ],

  users: [
    {
      user_id: 1,
      full_name: "John Mwangi",
      email: "john@example.com",
      phone: "0712345678",
      has_password: true,
      status: "active",
    },
    {
      user_id: 2,
      full_name: "Mary Wanjiku",
      email: "mary@example.com",
      phone: "0712345679",
      has_password: true,
      status: "active",
    },
    {
      user_id: 3,
      full_name: "Kevin Otieno",
      email: "kevin@example.com",
      phone: "0712345680",
      has_password: false,
      status: "active",
    },
    {
      user_id: 4,
      full_name: "Faith Akinyi",
      email: "faith@example.com",
      phone: "0712345681",
      has_password: true,
      status: "active",
    },
    {
      user_id: 5,
      full_name: "Brian Kamau",
      email: "brian@example.com",
      phone: "0712345682",
      has_password: true,
      status: "active",
    },
  ],

  voters: [
    {
      voter_id: 1,
      user_id: 1,
      member_identifier: "CS001",
      organization_unit_id: 1,
      eligibility_status: "eligible",
    },
    {
      voter_id: 2,
      user_id: 2,
      member_identifier: "CS002",
      organization_unit_id: 1,
      eligibility_status: "eligible",
    },
    {
      voter_id: 3,
      user_id: 3,
      member_identifier: "BUS001",
      organization_unit_id: 2,
      eligibility_status: "eligible",
    },
    {
      voter_id: 4,
      user_id: 4,
      member_identifier: "YM001",
      organization_unit_id: 3,
      eligibility_status: "eligible",
    },
  ],

  admins: [
    {
      admin_id: 1,
      user_id: 5,
      admin_level: "super_admin",
    },
  ],

  elections: [
    {
      election_id: 1,
      election_name: "2026 Student Council Election",
      description: "Annual leadership election",
      start_date: "2026-06-01",
      end_date: "2026-06-07",
      status: "ongoing",
      created_by: 1,
    },
  ],

  positions: [
    {
      position_id: 1,
      position_name: "President",
    },
    {
      position_id: 2,
      position_name: "Vice President",
    },
    {
      position_id: 3,
      position_name: "Secretary",
    },
  ],

  electionPositions: [
    {
      election_position_id: 1,
      election_id: 1,
      position_id: 1,
    },
    {
      election_position_id: 2,
      election_id: 1,
      position_id: 2,
    },
    {
      election_position_id: 3,
      election_id: 1,
      position_id: 3,
    },
  ],

  candidates: [
    {
      candidate_id: 1,
      voter_id: 2,
      election_position_id: 1,
      bio: "Passionate student leader",
      manifesto: "Improve student services",
      slogan: "Students First",
      photo_url: "/images/mary.jpg",
      status: "approved",
    },
    {
      candidate_id: 2,
      voter_id: 3,
      election_position_id: 1,
      bio: "Technology enthusiast",
      manifesto: "Digital transformation",
      slogan: "Forward Together",
      photo_url: "/images/kevin.jpg",
      status: "approved",
    },
  ],

  candidateDetails: [
    {
      detail_id: 1,
      candidate_id: 1,
      achievements: ["Class Representative", "Debate Champion"],
      skills: ["Leadership", "Communication"],
      previous_positions: ["ICT Club Chair"],
    },
  ],

  votingLinks: [
    {
      link_id: 1,
      voter_id: 1,
      election_id: 1,
      generated_by: 1,
      token: "ABCD1234XYZ",
      used: true,
      status: "used",
    },
    {
      link_id: 2,
      voter_id: 4,
      election_id: 1,
      generated_by: 1,
      token: "EFGH5678XYZ",
      used: false,
      status: "active",
    },
  ],

  votes: [
    {
      vote_id: 1,
      voter_id: 1,
      link_id: 1,
      voted_at: "2026-06-02T10:30:00",
      ip_address: "192.168.1.2",
      user_agent: "Chrome Windows",
    },
  ],

  voteDetails: [
    {
      vote_detail_id: 1,
      vote_id: 1,
      election_position_id: 1,
      candidate_id: 1,
    },
  ],

  results: [
    {
      result_id: 1,
      election_position_id: 1,
      candidate_id: 1,
      total_votes: 38,
      percentage: 65.5,
      rank: 1,
    },
  ],

  auditLog: [
    {
      audit_id: 1,
      admin_id: 1,
      action: "Created Election",
      entity_name: "Election",
      entity_id: 1,
      details: "Created 2026 Student Council Election",
    },
  ],
};
