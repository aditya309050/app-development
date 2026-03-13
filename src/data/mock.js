export const categories = [
  { id: '1', title: 'History', icon: 'history', color: '#FF9F43' },
  { id: '2', title: 'Science', icon: 'test-tube', color: '#00D2D3' },
  { id: '3', title: 'Politics', icon: 'landmark', color: '#54A0FF' },
  { id: '4', title: 'Geography', icon: 'map', color: '#10AC84' },
];

export const dailyQuiz = {
  id: 'dq-1',
  title: 'Daily GK Booster',
  questions: 10,
  estimatedTime: '5 min',
  points: 100,
};

export const sampleQuestions = [
  {
    id: 'q1',
    question: 'Who was the first Prime Minister of India?',
    options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhash Chandra Bose', 'Sardar Patel'],
    correct: 1,
    explanation: 'Jawaharlal Nehru was the first Prime Minister of independent India, serving from 1947 to 1964.',
  },
  {
    id: 'q2',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
    explanation: 'Mars is often called the Red Planet because of iron oxide (rust) on its surface.',
  },
];
