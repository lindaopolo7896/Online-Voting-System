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

    totalVoters: 374,
    votesCast: 344,
    turnout: 92,

    date: "2026-05-20",

    startTime: "2026-05-20T08:00:00",
    endTime: "2026-06-30T23:59:00",

    categories: [
      {
        id: 1,
        position: "President",

        results: [
          {
            candidate: "Ted Owalo",
            votes: 117,
            percentage: 39,
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=500",
          },

          {
            candidate: "Elsie May",
            votes: 104,
            percentage: 35,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
          },

          {
            candidate: "Jane Doe",
            votes: 74,
            percentage: 26,
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
          },
        ],
      },

      {
        id: 2,
        position: "Vice President",

        results: [
          {
            candidate: "Brian Kimani",
            votes: 132,
            percentage: 44,
            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
          },

          {
            candidate: "Sarah Mike",
            votes: 98,
            percentage: 33,
            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
          },

          {
            candidate: "Kevin Otieno",
            votes: 70,
            percentage: 23,
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
          },
        ],
      },

      {
        id: 3,
        position: "Secretary",

        results: [
          {
            candidate: "Mercy Atieno",
            votes: 145,
            percentage: 48,
            image:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
          },

          {
            candidate: "Ian Kariuki",
            votes: 96,
            percentage: 32,
            image:
              "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500",
          },

          {
            candidate: "Daisy Njeri",
            votes: 59,
            percentage: 20,
            image:
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: "ICT Club Election",
    organization: "ABC University",
    status: "completed",

    totalVoters: 150,
    votesCast: 130,
    turnout: 86,

    date: "2026-05-13",

    startTime: "2026-05-13T08:00:00",
    endTime: "2026-05-13T18:00:00",

    categories: [
      {
        id: 1,
        position: "Chairperson",

        results: [
          {
            candidate: "Johnson Doe",
            votes: 60,
            percentage: 46,
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=500",
          },

          {
            candidate: "Mary Smith",
            votes: 45,
            percentage: 35,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
          },

          {
            candidate: "Kelvin Otis",
            votes: 25,
            percentage: 19,
            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
          },
        ],
      },

      {
        id: 2,
        position: "Secretary",

        results: [
          {
            candidate: "Grace Kim",
            votes: 70,
            percentage: 54,
            image:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
          },

          {
            candidate: "Sarah Wilson",
            votes: 60,
            percentage: 46,
            image:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
          },
        ],
      },
    ],
  },

  {
    id: 3,
    title: "Church Youth Election",
    organization: "Grace Church",
    status: "completed",

    totalVoters: 80,
    votesCast: 72,
    turnout: 90,

    date: "2026-01-30",

    startTime: "2026-01-30T09:00:00",
    endTime: "2026-01-30T17:00:00",

    categories: [
      {
        id: 1,
        position: "Youth Leader",

        results: [
          {
            candidate: "Michael Lee",
            votes: 34,
            percentage: 47,
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
          },

          {
            candidate: "Jane Cooper",
            votes: 25,
            percentage: 35,
            image:
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
          },

          {
            candidate: "Kevin Brown",
            votes: 13,
            percentage: 18,
            image:
              "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500",
          },
        ],
      },
    ],
  },
];
// ==========================
// Candidates
// ==========================
export const candidates = [
  // ================= PRESIDENT =================
  {
    id: 1,
    name: "Johnson Doe",
    position: "President",
    course: "Bachelor of Science in Data Science",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43d?w=500",
    slogan: "Building with purpose",
    votes: 134,
    percentage: 39,
  },
  {
    id: 2,
    name: "Mary Smith",
    position: "President",
    course: "Computer Science",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    slogan: "Your voice matters",
    votes: 124,
    percentage: 36,
  },
  {
    id: 3,
    name: "Ted Owalo",
    position: "President",
    course: "Information Technology",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    slogan: "Future starts now",
    votes: 86,
    percentage: 25,
  },

  // ================= VICE PRESIDENT =================
  {
    id: 4,
    name: "Elsie May",
    position: "Vice President",
    course: "Software Engineering",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
    slogan: "Leadership through action",
    votes: 120,
    percentage: 45,
  },
  {
    id: 5,
    name: "Brian James",
    position: "Vice President",
    course: "Business IT",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500",
    slogan: "Together we grow",
    votes: 90,
    percentage: 34,
  },
  {
    id: 6,
    name: "Jane Cooper",
    position: "Vice President",
    course: "Cyber Security",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500",
    slogan: "Innovation for all",
    votes: 56,
    percentage: 21,
  },

  // ================= SECRETARY =================
  {
    id: 7,
    name: "Kevin Brown",
    position: "Secretary",
    course: "Computer Science",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500",
    slogan: "Clear communication matters",
    votes: 98,
    percentage: 30,
  },
  {
    id: 8,
    name: "Sarah Wilson",
    position: "Secretary",
    course: "Information Systems",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
    slogan: "Organized leadership",
    votes: 88,
    percentage: 27,
  },
  {
    id: 9,
    name: "Michael Lee",
    position: "Secretary",
    course: "Software Engineering",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    slogan: "Efficiency first",
    votes: 76,
    percentage: 23,
  },
  {
    id: 10,
    name: "Grace Kim",
    position: "Secretary",
    course: "Data Science",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
    slogan: "Connecting every voice",
    votes: 64,
    percentage: 20,
  },
];

// ==========================
// Voter Activity
// ==========================
export const voterActivity = [
  {
    time: "8:00 AM",
    votes: 20,
  },
  {
    time: "9:00 AM",
    votes: 90,
  },
  {
    time: "10:00 AM",
    votes: 160,
  },
  {
    time: "11:00 AM",
    votes: 270,
  },
  {
    time: "12:00 PM",
    votes: 344,
  },
];

// ==========================
// Selected Candidates
// ==========================
export const selectedCandidates = [
  {
    position: "President",
    candidate: "Johnson Doe",
  },
  {
    position: "Vice President",
    candidate: "Brian James",
  },
  {
    position: "Secretary",
    candidate: "Jane Doe",
  },
  {
    position: "Treasurer",
    candidate: "Mary Smith",
  },
  {
    position: "Representative",
    candidate: "Elsie May",
  },
];

// ==========================
// User Settings
// ==========================
export const userProfile = {
  fullName: "Eleanor Doe",
  email: "eleanor@example.com",
  voterId: "VT-839104",
  verified: true,
};

// ==========================
// Notifications / Guidelines
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

// ==========================
// Live Election Results
// ==========================

export const liveResults = {
  id: 1,
  title: "Student Council Election 2026",

  categories: [
    {
      position: "President",

      results: [
        {
          candidate: "Johnson Doe",
          votes: 134,
          percentage: 39,
        },

        {
          candidate: "Mary Smith",
          votes: 124,
          percentage: 36,
        },

        {
          candidate: "Ted Owalo",
          votes: 86,
          percentage: 25,
        },
      ],
    },

    {
      position: "Vice President",

      results: [
        {
          candidate: "Elsie May",
          votes: 120,
          percentage: 45,
        },

        {
          candidate: "Brian James",
          votes: 90,
          percentage: 34,
        },

        {
          candidate: "Jane Cooper",
          votes: 56,
          percentage: 21,
        },
      ],
    },

    {
      position: "Secretary",

      results: [
        {
          candidate: "Kevin Brown",
          votes: 98,
          percentage: 30,
        },

        {
          candidate: "Sarah Wilson",
          votes: 88,
          percentage: 27,
        },

        {
          candidate: "Michael Lee",
          votes: 76,
          percentage: 23,
        },

        {
          candidate: "Grace Kim",
          votes: 64,
          percentage: 20,
        },
      ],
    },
  ],
};
