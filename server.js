const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/submit-writing', async (req, res) => {
  const userAnswer = req.body.answer;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `You are a TOEFL writing evaluator. Score and give feedback on this writing:\n\n${userAnswer}\n\nGive a score from 0 to 30 and short feedback.`
      }
    ],
  });

  res.json({ feedback: response.choices[0].message.content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
