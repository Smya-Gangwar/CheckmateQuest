const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("!nfotrek@2o26", 10);
  await prisma.admin.upsert({
    where: {
        email: "admin@checkmatequest.com",
    },
    update: {
        hashed_password: hashedPassword,
    },
    create: {
        name: "Super Admin",
        email: "admin@checkmatequest.com",
        hashed_password: hashedPassword,
    },
  });
  console.log("Admin seeded");
  const questions = [
    {
        content: "NIT Trichy was established in which year",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "1964",
        difficulty_score: 1,
        category: "NITT Campus",
    },

    {
        content: "Which river is associated with the NIT Trichy campus?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Ganga",
            "Godavari",
            "Krishna",
            "Cauvery",
        ],
        answer: "Cauvery",
        difficulty_score: 2,
        category: "NITT Campus",
    },

    {
        content: "Which is NIT Trichy's annual technical festival?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Pragyan",
        difficulty_score: 2,
        category: "NITT Campus",
    },

    {
        content: "What was NIT Trichy formerly know as?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "IIT Trichy",
        "REC Tiruchirappalli",
        "GEC Trichy",
        "NIT Madras",
        ],
        answer: "REC Tiruchirappalli",
        difficulty_score: 2,
        category: "NITT Campus",
    },

    {
        content: "Which is NIT Trichy's annual cultural festival?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Festember",
        difficulty_score: 2,
        category: "NITT Campus",
    },

    {
        content: "The Department of Computer Applications' ACM chapter at NIT Trichy has which distinction?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "First ACM Student Chapter in India",
        "First IEEE chapter in India",
        "First coding club in India",
        "First NIT club",
        ],
        answer: "First ACM Student Chapter in India",
        difficulty_score: 5,
        category: "NITT Campus",
    },

    {
        content: "Identify the NIT Trichy building shown.",
        image_url: "https://drive.google.com/thumbnail?id=1j1PshELBkmk4kfH13i4KpuTriwsdBUl0&sz=w1000",
        question_type: "MCQ",
        options: [
        "Hostel Office",
        "Quarters security Office",
        "SAC building",
        "Security Office",
        ],
        answer: "Security Office",
        difficulty_score: 4,
        category: "NITT Campus",
    },

    {
        content: "🌳 Look Up! A tree stands at the heart of a hollow circle, hidden above your heads. Identify the NITT building.",
        image_url: "https://drive.google.com/thumbnail?id=1kg0mkGT7Eb3PgVEmDl6IiHMk00cc8Dk3&sz=w1000",
        question_type: "ONE_WORD",
        answer: "Capstone",
        difficulty_score: 7,
        category: "NITT Campus",
    },

    {
        content: "Let's call it a day! Identify the NITT building.",
        image_url: "https://drive.google.com/thumbnail?id=1cyx0XevwVzLLKdLsvGHNKNxx2M1IsVQi&sz=w1000",
        question_type: "ONE_WORD",
        answer: "Cafe Coffee Day",
        difficulty_score: 2,
        category: "NITT Campus",
    },

    {
        content: "Identify the NITT department this building belongs to.",
        image_url: "https://drive.google.com/thumbnail?id=1774zBZ1iXm0ejN97jyHC7-3SaKC-sdKc&sz=w1000",
        question_type: "ONE_WORD",
        answer: "EEE",
        difficulty_score: 4,
        category: "NITT Campus",
    },

    {
        content: "What do we call it?",
        image_url: "https://drive.google.com/thumbnail?id=14PX2HfbKRwbIREIsqqO7UyqGS72Hdqma&sz=w1000",
        question_type: "ONE_WORD",
        answer: "Guest House",
        difficulty_score: 6,
        category: "NITT Campus",
    },

    {
        content: "Identify the NITT department this building belongs to.",
        image_url: "https://drive.google.com/thumbnail?id=1hbMwvC9NfcDZN32_WWdinYpyYMPmEOFM&sz=w1000",
        question_type: "ONE_WORD",
        answer: "Mechanical",
        difficulty_score: 4,
        category: "NITT Campus",
    },

    {
        content: "What do we call it?",
        image_url: "https://drive.google.com/thumbnail?id=1sbt_B1I7Yo-xsoj8IBV-4EAZ4EjZLUcz&sz=w1000",
        question_type: "ONE_WORD",
        answer: "Post Office",
        difficulty_score: 2,
        category: "NITT Campus",
    },

    {
        content: "I have cities but no houses, forests but no trees, and rivers but no water. What am I?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Map",
        difficulty_score: 1,
        category: "Riddles & Logic",
    },

    {
        content: "What has one eye but cannot see?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Needle",
        difficulty_score: 1,
        category: "Riddles & Logic",
    },

    {
        content: "What can travel around the world while staying in one corner?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Map",
            "Stamp",
            "Coin",
            "Clock",
        ],
        answer: "Stamp",
        difficulty_score: 2,
        category: "Riddles & Logic",
    },

    {
        content: "If you have me, you want to share me. If you share me, you no longer have me. What am I?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Secret",
            "Knowledge",
            "Wealth",
            "Friendship",
        ],
        answer: "Secret",
        difficulty_score: 2,
        category: "Riddles & Logic",
    },

    {
        content: "What word becomes shorter when you add two letters to it?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Short",
        difficulty_score: 3,
        category: "Riddles & Logic",
    },

    {
        content: "A man walks in the rain without an umbrella, but not a single hair on his head gets wet because he is _____",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "bald",
        difficulty_score: 2,
        category: "Riddles & Logic",
    },

    {
        content: "A clock strikes 6 times in 5 seconds. How long does it take to strike 12 times?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "10 sec",
        "11 sec",
        "12 sec",
        "15 sec",
        ],
        answer: "11 sec",
        difficulty_score: 5,
        category: "Riddles & Logic",
    },

    {
        content: "It belongs to you, but others use it more often than you do. What is it?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Name",
        difficulty_score: 2,
        category: "Riddles & Logic",
    },

    {
        content: "You measure my life in hours and I serve you by expiring. I’m quick when I’m thin and slow when I’m fat. The wind is my enemy.",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Candle",
        difficulty_score: 6,
        category: "Riddles & Logic",
    },

    {
        content: "What is seen in the middle of March and April that can’t be seen at the beginning or end of either month?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "R",
        difficulty_score: 5,
        category: "Riddles & Logic",
    },

    {
        content: "English word : The first two letters signify a male, the first three letters signify a female, the first four letters signify a great, while the entire word signifies a great woman. What is the word? ",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Heroine",
        difficulty_score: 8,
        category: "Riddles & Logic",
    },

    {
        content: "What English word has three consecutive double letters?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Bookkeeper",
        difficulty_score: 7,
        category: "Riddles & Logic",
    },

    {
        content: "What disappears as soon as you say its name?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Silence",
        difficulty_score: 4,
        category: "Riddles & Logic",
    },

    {
        content: "What gets wet while drying?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Towel",
        difficulty_score: 1,
        category: "Riddles & Logic",
    },

    {
        content: "How many letters are in the alphabet?",
        question_type: "ONE_WORD",
        answer: "11",
        difficulty_score: 5,
        category: "Riddles & Logic",
    },

    {
        content: "What has many keys but cannot open a single lock?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Keyboard",
        difficulty_score: 3,
        category: "Riddles & Logic",
    },

    {
        content: "I am taken from a mine and shut inside a wooden case, from which I am never released. What am I?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Graphite",
        difficulty_score: 4,
        category: "Riddles & Logic",
    },

    {
        content: "A father and son are in a car with the father's father. There are two fathers and two sons, but only three people. How?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "They are three generations",
            "One person is adopted",
            "One person is a driver",
            "There are actually four people"
        ],
        answer: "They are three generations",
        difficulty_score: 4,
        category: "Riddles & Logic",
    },

    {
        content: "What occurs once in a minute, twice in a moment, but never in a thousand years?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "M",
        difficulty_score: 5,
        category: "Riddles & Logic",
    },

    {
        content: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Echo",
        difficulty_score: 5,
        category: "Riddles & Logic",
    },

    {
        content: "A farmer has 17 sheep. All but 9 die. How many sheep are left?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "9",
        difficulty_score: 3,
        category: "Riddles & Logic",
    },

    {
        content: "Which planet is known as the Red Planet?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Venus",
        "Mars",
        "Jupiter",
        "Mercury"
        ],
        answer: "Mars",
        difficulty_score: 1,
        category: "GK",
    },

    {
        content: "What is the chemical symbol for gold?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Ag",
        "Gd",
        "Hg",
        "Au",
        ],
        answer: "Au",
        difficulty_score: 1,
        category: "GK",
    },

    {
        content: "What is the smallest prime number?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "0",
        "1",
        "2",
        "3",
        ],
        answer: "2",
        difficulty_score: 2,
        category: "GK",
    },

    {
        content: "Which country gifted the Statue of Liberty to the USA?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "France",
        "Germany",
        "Italy",
        "Spain",
        ],
        answer: "France",
        difficulty_score: 3,
        category: "GK",
    },

    {
        content: "Which planet has the shortest day?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Mercury",
            "Saturn",
            "Neptune",
            "Jupiter",
        ],
        answer: "Jupiter",
        difficulty_score: 3,
        category: "GK",
    },

    {
        content: "Which is the only continent crossed by the Equator, Prime Meridian, Tropic of Cancer and Tropic of Capricorn?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Europe",
            "Africa",
            "Asia",
            "Australia",
        ],
        answer: "Africa",
        difficulty_score: 7,
        category: "GK",
    },

    {
        content: "Piece of land surrounded by water on all sides?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Island",
        difficulty_score: 2,
        category: "GK",
    },

    {
        content: "Which is the fastest land animal?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Cheetah",
        difficulty_score: 2,
        category: "GK",
    },

    {
        content: "Who painted the Mona Lisa?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Leonardo da Vinci",
            "Pablo Picasso",
            "Vincent van Gogh",
            "Claude Monet"
        ],
        answer: "Leonardo da Vinci",
        difficulty_score: 2,
        category: "GK",
    },

    {
        content: "Which blood group is known as the universal donor for red blood cells?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "O-",
            "A-",
            "B-",
            "AB-"
        ],
        answer: "O-",
        difficulty_score: 4,
        category: "GK",
    },

    {
        content: "Which country has the largest land area in the world?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Russia",
        difficulty_score: 3,
        category: "GK",
    },

    {
        content: "Which particle has a negative electric charge?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Electron",
        difficulty_score: 3,
        category: "GK",
    },

    {
        content: "Which gas makes up the largest percentage of Earth's atmosphere?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Oxygen",
            "Nitrogen",
            "Carbon Dioxide",
            "Hydrogen"
        ],
        answer: "Nitrogen",
        difficulty_score: 4,
        category: "GK",
    },

    {
        content: "Which element is named after the planet Uranus?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Uranium",
        difficulty_score: 8,
        category: "GK",
    },

    {
        content: "The concept of zero as a number was developed and formalized in which mathematical tradition?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Indian",
            "Roman",
            "Greek",
            "Egyptian"
        ],
        answer: "Indian",
        difficulty_score: 6,
        category: "GK",
    },

    {
        content: "Which gas is a major contributor to the human-caused greenhouse effect?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Carbon dioxide",
            "Nitrogen",
            "Oxygen",
            "Argon"
        ],
        answer: "Carbon dioxide",
        difficulty_score: 3,
        category: "GK",
    },

    {
        content: "Which vitamin is produced in the human skin when exposed to sunlight?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Vitamin D",
        difficulty_score: 3,
        category: "GK",
    },

    {
        content: "Which imaginary line divides Earth into the Eastern and Western Hemispheres?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Equator",
            "Prime Meridian",
            "Tropic of Cancer",
            "International Date Line"
        ],
        answer: "Prime Meridian",
        difficulty_score: 4,
        category: "GK",
    },

    {
        content: "What is the SI unit of force?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Newton",
        difficulty_score: 4,
        category: "GK",
    },

    {
        content: "Which is the largest bone in the human body?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Femur",
        difficulty_score: 4,
        category: "GK",
    },

    {
        content: "Which strait separates Asia from North America?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Bering Strait",
        difficulty_score: 5,
        category: "GK",
    },

    {
        content: "Which was the first artificial satellite launched into space?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Sputnik 1",
        difficulty_score: 5,
        category: "GK",
    },

    {
        content: "Which element has the chemical symbol W?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Tungsten",
        difficulty_score: 6,
        category: "GK",
    },

    {
        content: "Which metal has the highest electrical conductivity at room temperature?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Silver",
        difficulty_score: 6,
        category: "GK",
    },

    {
        content: "Which planet rotates on its side, with an axial tilt of about 98 degrees?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Uranus",
        difficulty_score: 7,
        category: "GK",
    },

    {
        content: "Which is the largest lake in the world by surface area?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Lake Superior",
            "Caspian Sea",
            "Lake Victoria",
            "Lake Baikal"
        ],
        answer: "Caspian Sea",
        difficulty_score: 8,
        category: "GK",
    },

    {
        content: "Which country has three capital cities serving different branches or functions of government?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "South Africa",
        difficulty_score: 9,
        category: "GK",
    },

    {
        content: "How many squares are on a standard chessboard?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "64",
        difficulty_score: 1,
        category: "Chess",
    },

    {
        content: "Which chess piece moves in an L-shape?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Knight",
        difficulty_score: 1,
        category: "Chess",
    },

    {
        content: "Which piece moves diagonally any number of squares?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Bishop",
        difficulty_score: 1,
        category: "Chess",
    },

    {
        content: "Which chess piece is usually the most powerful?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Queen",
            "Rook",
            "Bishop",
            "Knight"
        ],
        answer: "Queen",
        difficulty_score: 2,
        category: "Chess",
    },

    {
        content: "How many players participate in a chess game?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "two",
        difficulty_score: 1,
        category: "Chess",
    },

    {
        content: "Which piece always remains on the same color square?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Bishop",
        difficulty_score: 2,
        category: "Chess",
    },

    {
        content: "What is the objective of chess?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Checkmate the opponent's king",
            "Capture all opponent's pieces",
            "Capture the queen",
            "Reach the last rank"
        ],
        answer: "Checkmate the opponent's king",
        difficulty_score: 3,
        category: "Chess",
    },

    {
        content: "White to move. What is the best move?",
        image_url: "https://drive.google.com/thumbnail?id=1fxttF9tgClGRwYYSHeb_5uAk0O6uqYsx&sz=w1000",
        question_type: "MCQ",
        options: [
            "Qd1",
            "Nxf5",
            "Qxd7",
            "Nf7+"
        ],
        answer: "Nf7+",
        difficulty_score: 7,
        category: "Chess",
    },

    {
        content: "What is the only chess piece that can jump over other pieces?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Knight",
            "Bishop",
            "Rook",
            "Queen"
        ],
        answer: "Knight",
        difficulty_score: 3,
        category: "Chess",
    },

    {
        content: "If a pawn reaches the opposite end of the chessboard, what can it be promoted to?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "Only a Queen",
            "Queen, Rook, Bishop, or Knight",
            "King, Queen, or Rook",
            "Any chess piece"
        ],
        answer: "Queen, Rook, Bishop, or Knight",
        difficulty_score: 5,
        category: "Chess",
    },

    {
        content: "What is the approximate point value traditionally assigned to a rook?",
        image_url: null,
        question_type: "MCQ",
        options: [
            "3 points",
            "5 points",
            "7 points",
            "9 points"
        ],
        answer: "5 points",
        difficulty_score: 4,
        category: "Chess",
    },

    {
        content: "What is a position called when a player has no legal move but their king is not in check?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Stalemate",
        difficulty_score: 5,
        category: "Chess",
    },

    {
        content: "Which special move allows a king and rook to move simultaneously?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Castling",
        difficulty_score: 6,
        category: "Chess",
    },

    {
        content: "What is the maximum number of queens one player can theoretically have on the board at the same time?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "9",
        difficulty_score: 9,
        category: "Chess",
    },

    {
        content: "What is the maximum number of knights one player can theoretically have on the board at the same time?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "10",
        difficulty_score: 10,
        category: "Chess",
    },

    ];

  for (const question of questions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log("Questions seeded");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });