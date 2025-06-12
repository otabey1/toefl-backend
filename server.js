const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const OpenAI = require("openai");

const prompts = [
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

app.get('/api/writing-prompt', (req, res) => {
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  res.json({ prompt: randomPrompt });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
