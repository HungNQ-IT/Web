// Database câu hỏi 
const questionDatabase = {
    math: [
        {
            id: 1,
            question: "If 2x + 5 = 15, what is the value of x?",
            options: ["3", "5", "7", "10"],
            correct: 1,
            explanation: "Giải:\n2x + 5 = 15\n2x = 15 - 5\n2x = 10\nx = 5"
        },
        {
            id: 2,
            question: "What is 15% of 80?",
            options: ["10", "12", "14", "16"],
            correct: 1,
            explanation: "Giải:\n15% × 80 = 0.15 × 80 = 12"
        },
        {
            id: 3,
            question: "If a circle has a radius of 5, what is its area? (Use π ≈ 3.14)",
            options: ["31.4", "78.5", "157", "314"],
            correct: 1,
            explanation: "Giải:\nArea = πr²\n= 3.14 × 5²\n= 3.14 × 25\n= 78.5"
        },
        {
            id: 4,
            question: "If x = 3 and y = 4, what is the value of 2x + 3y?",
            options: ["18", "20", "22", "24"],
            correct: 1,
            explanation: "Giải:\n2x + 3y = 2(3) + 3(4) = 6 + 12 = 18"
        }
    ],
    reading: [
        {
            id: 4,
            question: "Which word is closest in meaning to 'ubiquitous'?",
            options: ["Rare", "Everywhere", "Hidden", "Ancient"],
            correct: 1,
            explanation: "Ubiquitous có nghĩa là 'có mặt ở khắp mọi nơi cùng một lúc'.\nĐáp án: Everywhere"
        },
        {
            id: 5,
            question: "Identify the grammatical error: 'The team were playing excellent.'",
            options: [
                "No error",
                "'were' should be 'was'",
                "'playing' should be 'played'",
                "'excellent' should be 'excellently'"
            ],
            correct: 3,
            explanation: "Trạng từ 'excellently' cần được sử dụng để bổ nghĩa cho động từ 'playing', không phải tính từ 'excellent'.\nCâu đúng: 'The team were playing excellently.'"
        }
    ]
};