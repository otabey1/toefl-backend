
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// 1. Writing Prompt
const writingPrompts = [
  "Do you agree or disagree that it's better to study alone than with a group?",
  "Some people think it’s better to work for a small company. Others prefer a large one. Which do you prefer and why?",
  "Do you agree or disagree with the idea that children should begin formal education at a very early age?",
  "People learn more from failure than success. Do you agree or disagree?",
  "Which is more important: having a job you enjoy or a job that pays well?",
  "Do you prefer living in one place your whole life or moving to different places?",
  "Should students be required to wear uniforms in school?",
  "Do you agree or disagree that watching TV has a negative effect on children?",
  "Some people like to plan everything in advance. Others prefer to be spontaneous. Which do you prefer and why?",
  "Is it better to spend money on experiences (like travel) or material things (like electronics)?",
  "Do you think grades encourage students to learn?",
  "Should college education be free for everyone?",
  "Do you agree or disagree that technology makes communication better?",
  "Is it more important to be talented or to work hard?",
  "Should governments spend more money on space exploration or solving problems on Earth?",
  "Do you prefer to get news from newspapers, television, or the internet? Why?",
  "Would you rather have a fast-paced job with high stress or a relaxed job with less pay?",
  "Do you agree or disagree that university students should live away from home?",
  "Is it better to spend free time alone or with others?",
  "Should parents limit their children’s screen time?"
];

app.get('/api/writing-prompt', (req, res) => {
  const prompt = writingPrompts[Math.floor(Math.random() * writingPrompts.length)];
  res.json({ prompt });
});

// 2. Writing Submission
app.post('/api/submit-writing', async (req, res) => {
  const { answer } = req.body;
  const gptPrompt = `Evaluate this TOEFL writing response:
"${answer}"
Give a score from 0 to 30 and explain why.`;

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: gptPrompt }],
  });

  const feedback = completion.data.choices[0].message.content;
  res.json({ feedback });
});

// 3. Reading Passages (2 passages with questions)
app.get('/api/reading-passages', (req, res) => {
  const passage1 = {
    title: "The History of Flight",
    text: "The development of aviation began with early balloon flights...",
    questions: [
      { q: "What is the main idea of the passage?", options: ["A", "B", "C", "D"], answer: "A" },
      // 9 more...
    ]
  };

  const passage2 = {
    title: "Renewable Energy Sources",
    text: "Renewable energy is obtained from natural sources...",
    questions: [
      { q: "Which is a negative fact mentioned?", options: ["A", "B", "C", "D"], answer: "C" },
      // 9 more...
    ]
  };

  res.json({ passages: [passage1, passage2] });
});

// 4. Submit Reading
app.post('/api/submit-reading', (req, res) => {
  const { answers } = req.body;
  // TODO: compare answers to correct ones, return score
  res.json({ score: 25 });
});

// 5. Listening Audio URL
app.get('/api/listening-audio', (req, res) => {
  res.json({ audioUrl: 'https://example.com/audio.mp3' });
});

// 6. Listening Questions
app.get('/api/listening-questions', (req, res) => {
  res.json({
    questions: [
      { q: "What is the main point?", options: ["A", "B", "C", "D"], answer: "B" },
      // more...
    ]
  });
});

// 7. Submit Listening
app.post('/api/submit-listening', (req, res) => {
  const { answers } = req.body;
  // TODO: score answers
  res.json({ score: 27 });
});

// 8. Speaking Prompt
const speakingPrompts = [
  "Do you prefer to study in the morning or at night?",
  "Describe your favorite place to relax and why.",
  "What is one important skill every person should have?"
];

app.get('/api/speaking-topic', (req, res) => {
  const topic = speakingPrompts[Math.floor(Math.random() * speakingPrompts.length)];
  res.json({ topic });
});

// 9. Submit Full Test
app.post('/api/submit-test', (req, res) => {
  const { writingScore, readingScore, listeningScore, speakingScore } = req.body;
  const total = writingScore + readingScore + listeningScore + speakingScore;
  res.json({
    writing: writingScore,
    reading: readingScore,
    listening: listeningScore,
    speaking: speakingScore,
    total
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
