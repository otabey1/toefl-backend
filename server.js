const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

// Writing Prompt
app.get('/api/writing-prompt', (req, res) => {
  res.json({ prompt: "Do you agree or disagree with the idea that technology has made people more alone?" });
});

// Writing Feedback
app.post('/api/submit-writing', async (req, res) => {
  const userAnswer = req.body.answer;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `You are a TOEFL writing evaluator. Score and give feedback on this writing:\n\n${userAnswer}\n\nGive a score from 0 to 30 and short feedback.`
      }
    ],
  });

  res.json({ feedback: response.data.choices[0].message.content });
});

// Reading + Speaking prompts (sample)
app.get('/api/reading', (req, res) => {
  res.json({
    passage: "Bees play a crucial role in pollination...",
    questions: [
      { question: "What is the main idea?", options: ["A. A", "B. B", "C. C", "D. D"] },
      { question: "What do bees help with?", options: ["A. A", "B. B", "C. C", "D. D"] }
    ]
  });
});

app.get('/api/speaking-prompt', (req, res) => {
  res.json({ prompt: "Describe your favorite place to relax and why." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
