const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: {
        email: "admin@checkmatequest.com",
    },
    update: {},
    create: {
        name: "Super Admin",
        email: "admin@checkmatequest.com",
        hashed_password: hashedPassword,
    },
  });
  console.log("Admin seeded");
  const questions = [
    // EASY
    {
        content: "Capital of India?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Delhi",
        difficulty_score: 2,
        category: "GK",
    },

    {
        content: "5 + 7 = ?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "12",
        difficulty_score: 1,
        category: "Math",
    },

    {
        content: "HTML stands for?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Hyper Text Markup Language",
        "HighText Machine Language",
        "Hyper Transfer Markup Language",
        "None",
        ],
        answer: "Hyper Text Markup Language",
        difficulty_score: 2,
        category: "Tech",
    },

    {
        content: "Largest planet?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Mars",
        "Earth",
        "Jupiter",
        "Saturn",
        ],
        answer: "Jupiter",
        difficulty_score: 2,
        category: "Science",
    },

    {
        content: "Binary of decimal 2?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "10",
        difficulty_score: 3,
        category: "CS",
    },

    {
        content: "Which data structure uses FIFO?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Stack",
        "Queue",
        "Tree",
        "Heap",
        ],
        answer: "Queue",
        difficulty_score: 4,
        category: "DSA",
    },

    {
        content: "Identify the data structure shown",
        image_url:
        "https://upload.wikimedia.org/wikipedia/commons/5/5a/Binary_tree_v2.svg",
        question_type: "MCQ",
        options: [
        "Binary Tree",
        "Linked List",
        "Queue",
        "Heap",
        ],
        answer: "Binary Tree",
        difficulty_score: 4,
        category: "DSA",
    },

    // MEDIUM

    {
        content: "Time complexity of binary search?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(1)",
        ],
        answer: "O(log n)",
        difficulty_score: 5,
        category: "DSA",
    },

    {
        content: "React is developed by?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "Facebook",
        difficulty_score: 4,
        category: "Web",
    },

    {
        content: "Which protocol is secure HTTP?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "HTTPS",
        difficulty_score: 5,
        category: "Networking",
    },

    {
        content: "SQL stands for?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Structured Query Language",
        "Simple Query Language",
        "Sequential Query Language",
        "System Query Language",
        ],
        answer: "Structured Query Language",
        difficulty_score: 5,
        category: "DBMS",
    },

    {
        content: "Which traversal uses queue internally?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "DFS",
        "BFS",
        "Inorder",
        "Postorder",
        ],
        answer: "BFS",
        difficulty_score: 5,
        category: "Algorithms",
    },

    {
        content: "Identify the sorting algorithm graph",
        image_url:
        "https://upload.wikimedia.org/wikipedia/commons/c/c8/Bubble-sort-example-300px.gif",
        question_type: "MCQ",
        options: [
        "Merge Sort",
        "Quick Sort",
        "Bubble Sort",
        "Heap Sort",
        ],
        answer: "Bubble Sort",
        difficulty_score: 6,
        category: "Algorithms",
    },

    {
        content: "Which layer handles routing?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Transport",
        "Session",
        "Network",
        "Application",
        ],
        answer: "Network",
        difficulty_score: 6,
        category: "Networking",
    },

    {
        content: "HTTP default port?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "80",
        difficulty_score: 5,
        category: "Networking",
    },

    // HARD

    {
        content: "Worst case time complexity of quicksort?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)",
        ],
        answer: "O(n²)",
        difficulty_score: 8,
        category: "Algorithms",
    },

    {
        content: "Normalization removes?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Redundancy",
        "Compilation",
        "Execution",
        "Concurrency",
        ],
        answer: "Redundancy",
        difficulty_score: 7,
        category: "DBMS",
    },

    {
        content: "OSI model has how many layers?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "7",
        difficulty_score: 8,
        category: "Networking",
    },

    {
        content: "Which scheduling algorithm may cause starvation?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "FCFS",
        "Round Robin",
        "Priority Scheduling",
        "FIFO",
        ],
        answer: "Priority Scheduling",
        difficulty_score: 8,
        category: "OS",
    },

    {
        content: "Deadlock requires how many Coffman conditions?",
        image_url: null,
        question_type: "ONE_WORD",
        answer: "4",
        difficulty_score: 9,
        category: "OS",
    },

    {
        content: "Which normal form removes transitive dependency?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "1NF",
        "2NF",
        "3NF",
        "BCNF",
        ],
        answer: "3NF",
        difficulty_score: 8,
        category: "DBMS",
    },

    {
        content: "Identify the traversal shown in image",
        image_url:
        "https://upload.wikimedia.org/wikipedia/commons/4/48/Inorder-traversal.gif",
        question_type: "MCQ",
        options: [
        "Preorder",
        "Postorder",
        "Level Order",
        "Inorder",
        ],
        answer: "Inorder",
        difficulty_score: 8,
        category: "DSA",
    },

    {
        content: "TCP is connection oriented?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "True",
        "False",
        ],
        answer: "True",
        difficulty_score: 7,
        category: "Networking",
    },

    {
        content: "Which lock allows multiple readers simultaneously?",
        image_url: null,
        question_type: "MCQ",
        options: [
        "Mutex",
        "Semaphore",
        "Read Write Lock",
        "Spin Lock",
        ],
        answer: "Read Write Lock",
        difficulty_score: 9,
        category: "OS",
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