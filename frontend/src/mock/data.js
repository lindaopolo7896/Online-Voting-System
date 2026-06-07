// mockData.js

// ==========================
// Elections
// ==========================

export const elections = [
  {
    id: 1,

    title: "Student Council Election 2026",

    organization: "ABC University",

    status: "live",

    date: "2026-06-15",

    startTime: "2026-06-15T08:00:00",

    endTime: "2026-06-15T22:30:00",

    startDate: "June 15, 2026 • 08:00 AM",

    endDate: "June 15, 2026 • 10:30 PM",

    duration: "14h 30m",

    resultPublished: null,

    totalVoters: 374,

    votesCast: 344,

    turnout: 92,

    categories: [
      {
        id: 1,

        position: "President",

        results: [
          {
            candidate: "Ted Owalo",

            votes: 134,

            percentage: 39,

            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=500",
          },

          {
            candidate: "Elsie May",

            votes: 124,

            percentage: 36,

            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
          },

          {
            candidate: "Jane Doe",

            votes: 86,

            percentage: 25,

            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
          },
        ],
      },

      {
        id: 2,

        position: "Vice President",

        results: [
          {
            candidate: "Brian James",

            votes: 145,

            percentage: 45,

            image:
              "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500",
          },

          {
            candidate: "Sarah Mike",

            votes: 110,

            percentage: 34,

            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
          },

          {
            candidate: "Kevin Otieno",

            votes: 69,

            percentage: 21,

            image:
              "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500",
          },
        ],
      },

      {
        id: 3,

        position: "Secretary",

        results: [
          {
            candidate: "Mercy Atieno",

            votes: 160,

            percentage: 48,

            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
          },

          {
            candidate: "Ian Kariuki",

            votes: 100,

            percentage: 30,

            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
          },

          {
            candidate: "Daisy Njeri",

            votes: 74,

            percentage: 22,

            image:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
          },
        ],
      },
    ],
  },

  // ==========================================
  // COMPLETED ELECTION
  // ==========================================

  {
    id: 2,

    title: "ICT Club Election",

    organization: "ABC University",

    status: "completed",

    date: "2026-05-20",

    startTime: "2026-05-20T08:00:00",

    endTime: "2026-05-20T18:00:00",

    startDate: "May 20, 2026 • 08:00 AM",

    endDate: "May 20, 2026 • 06:00 PM",

    duration: "10h",

    resultPublished: "May 20, 2026 • 06:15 PM",

    totalVoters: 150,

    votesCast: 130,

    turnout: 86,

    categories: [
      {
        id: 1,

        position: "President",

        results: [
          {
            candidate: "Johnson Doe",

            votes: 72,

            percentage: 55,

            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=500",
          },

          {
            candidate: "Mary Smith",

            votes: 58,

            percentage: 45,

            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
          },
        ],
      },

      {
        id: 2,

        position: "Vice President",

        results: [
          {
            candidate: "Jane Cooper",

            votes: 80,

            percentage: 62,

            image:
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
          },

          {
            candidate: "Brian James",

            votes: 50,

            percentage: 38,

            image:
              "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500",
          },
        ],
      },

      {
        id: 3,

        position: "Secretary",

        results: [
          {
            candidate: "Grace Kim",

            votes: 67,

            percentage: 52,

            image:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
          },

          {
            candidate: "Sarah Wilson",

            votes: 63,

            percentage: 48,

            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
          },
        ],
      },
    ],
  },

  // ==========================================
  // CHURCH ELECTION
  // ==========================================

  {
    id: 3,

    title: "Church Youth Election",

    organization: "Grace Church",

    status: "completed",

    date: "2026-04-10",

    startTime: "2026-04-10T09:00:00",

    endTime: "2026-04-10T15:00:00",

    startDate: "April 10, 2026 • 09:00 AM",

    endDate: "April 10, 2026 • 03:00 PM",

    duration: "6h",

    resultPublished: "April 10, 2026 • 03:20 PM",

    totalVoters: 80,

    votesCast: 72,

    turnout: 90,

    categories: [
      {
        id: 1,

        position: "President",

        results: [
          {
            candidate: "Pastor Mike",

            votes: 40,

            percentage: 56,

            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
          },

          {
            candidate: "Kevin Brown",

            votes: 32,

            percentage: 44,

            image:
              "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500",
          },
        ],
      },

      {
        id: 2,

        position: "Secretary",

        results: [
          {
            candidate: "Sarah Wilson",

            votes: 41,

            percentage: 57,

            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
          },

          {
            candidate: "Grace Kim",

            votes: 31,

            percentage: 43,

            image:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
          },
        ],
      },
    ],
  },

  // ==========================================
  // UPCOMING ELECTION
  // ==========================================

  {
    id: 4,

    title: "Faculty Representative Election",

    organization: "ABC University",

    status: "upcoming",

    date: "2026-08-01",

    startTime: "2026-08-01T08:00:00",

    endTime: "2026-08-01T20:00:00",

    startDate: "August 1, 2026 • 08:00 AM",

    endDate: "August 1, 2026 • 08:00 PM",

    duration: "12h",

    resultPublished: null,

    totalVoters: 210,

    votesCast: 0,

    turnout: 0,

    categories: [
      {
        id: 1,

        position: "President",

        results: [],
      },

      {
        id: 2,

        position: "Vice President",

        results: [],
      },

      {
        id: 3,

        position: "Secretary",

        results: [],
      },
    ],
  },
];

// ==========================
// USER PROFILE
// ==========================

export const userProfile = {
  fullName: "Eleanor Doe",

  email: "eleanor@example.com",

  voterId: "VT-839104",

  verified: true,
};

// ==========================
// GUIDELINES
// ==========================

export const guidelines = [
  {
    id: 1,

    text: "Each voter can vote only once.",
  },

  {
    id: 2,

    text: "Do not share your voting link.",
  },

  {
    id: 3,

    text: "Votes cannot be changed after submission.",
  },

  {
    id: 4,

    text: "Election results may update in real time.",
  },

  {
    id: 5,

    text: "Keep your credentials secure.",
  },
];

export const users = [
  {
    id: 1,
    firstName: "Grace",
    lastName: "Mwangi",
    email: "grace@example.com",
    role: "ELECTION_MANAGER",
    avatar: null,
    password: "Manager123",
  },
  {
    id: 2,
    firstName: "Brian",
    lastName: "Otieno",
    email: "brian@example.com",
    role: "VOTER",
    avatar: null,
    password: "Voter123",
  },
];
