import React from "react";
import ResultAnalysis from "../../components/voter/ResultAnalysis";
import TopBar from "../../components/voter/TopBar";

const elections = [
  {
    id: 1,
    title: "2026 Student Council Election",
    status: "live",
    participated: true,
    date: "May 18, 2026",
    totalVoters: 362,
    votesCast: 344,
    turnout: 95,

    positions: [
      {
        id: 1,
        name: "President",
        candidates: [
          {
            id: 1,
            name: "Ted Owalo",
            course: "BSc Computer Science",
            votes: 117,
            percentage: 39,
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
          },
          {
            id: 2,
            name: "Elsie May",
            course: "BBIT",
            votes: 104,
            percentage: 35,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          },
          {
            id: 3,
            name: "Jane Doe",
            course: "Software Engineering",
            votes: 74,
            percentage: 26,
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
          },
        ],
      },

      {
        id: 2,
        name: "Vice President",
        candidates: [
          {
            id: 4,
            name: "Brian Kimani",
            course: "BSc Information Technology",
            votes: 140,
            percentage: 40,
            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
          },
          {
            id: 5,
            name: "Sarah Mike",
            course: "BCom Finance",
            votes: 122,
            percentage: 35,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
          },
          {
            id: 6,
            name: "Kevin Otieno",
            course: "BSc Data Science",
            votes: 86,
            percentage: 25,
            image:
              "https://images.unsplash.com/photo-1504593811423-6dd665756598",
          },
        ],
      },

      {
        id: 3,
        name: "Secretary",
        candidates: [
          {
            id: 7,
            name: "Mercy Atieno",
            course: "BSc Information Systems",
            votes: 132,
            percentage: 42,
            image:
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
          },
          {
            id: 8,
            name: "Ian Kariuki",
            course: "Computer Networks",
            votes: 98,
            percentage: 31,
            image:
              "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
          },
          {
            id: 9,
            name: "Daisy Njeri",
            course: "BBIT",
            votes: 82,
            percentage: 27,
            image:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9",
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: "2025 Student Council Election",
    status: "ended",
    participated: true,
    date: "Nov 10, 2025",
    totalVoters: 400,
    votesCast: 348,
    turnout: 87,

    positions: [
      {
        id: 4,
        name: "President",
        candidates: [
          {
            id: 10,
            name: "David Mwangi",
            course: "Computer Science",
            votes: 180,
            percentage: 52,
            image:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
          },
          {
            id: 11,
            name: "Lisa Achieng",
            course: "BBIT",
            votes: 168,
            percentage: 48,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          },
        ],
      },

      {
        id: 5,
        name: "Treasurer",
        candidates: [
          {
            id: 12,
            name: "Mark Otieno",
            course: "Finance",
            votes: 200,
            percentage: 57,
            image:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
          },
          {
            id: 13,
            name: "Faith Wanjiru",
            course: "Economics",
            votes: 148,
            percentage: 43,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
          },
        ],
      },
    ],
  },

  {
    id: 3,
    title: "2027 Student Council Election",
    status: "scheduled",
    participated: false,
    date: "Jun 15, 2027",
    totalVoters: 450,
    votesCast: 0,
    turnout: 0,

    positions: [
      {
        id: 6,
        name: "President",
        candidates: [
          {
            id: 14,
            name: "Chris Maina",
            course: "Software Engineering",
            votes: 0,
            percentage: 0,
            image:
              "https://images.unsplash.com/photo-1504593811423-6dd665756598",
          },
          {
            id: 15,
            name: "Nancy Atieno",
            course: "Data Science",
            votes: 0,
            percentage: 0,
            image:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9",
          },
        ],
      },

      {
        id: 7,
        name: "Secretary",
        candidates: [
          {
            id: 16,
            name: "Brian Ouma",
            course: "Information Systems",
            votes: 0,
            percentage: 0,
            image:
              "https://images.unsplash.com/photo-1504257432389-52343af06ae3",
          },
          {
            id: 17,
            name: "Sharon Kemunto",
            course: "BBIT",
            votes: 0,
            percentage: 0,
            image:
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
          },
        ],
      },
    ],
  },
];
function ResultsPage() {
  return (
    <div>
      <TopBar page="Election Results" />
      <ResultAnalysis />
    </div>
  );
}

export default ResultsPage;
