
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('public'));

// app.use(express.static('public'));

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
  const passage = {
    text: "In recent decades, climate change has emerged as a significant global challenge that threatens both natural ecosystems and human societies. Scientists around the world agree that rising levels of greenhouse gases, such as carbon dioxide and methane, are major contributors to global warming. These gases trap heat in the Earth’s atmosphere, causing average temperatures to rise. This warming trend has been linked to more frequent and intense weather events, including hurricanes, droughts, and heatwaves. In the Arctic, for example, ice sheets are melting at unprecedented rates, leading to rising sea levels that threaten coastal cities. Human activities are the primary source of greenhouse gas emissions. The burning of fossil fuels for electricity, transportation, and industrial processes releases vast amounts of carbon into the atmosphere. Deforestation also plays a role, as trees that absorb carbon dioxide are cut down for agriculture and development. To address these issues, many countries have joined international agreements such as the Paris Accord, which aims to limit global temperature rise to below 2 degrees Celsius. Mitigation strategies include transitioning to renewable energy sources like wind, solar, and hydroelectric power. Additionally, improving energy efficiency in homes and businesses can reduce overall emissions. On a personal level, individuals can contribute by reducing waste, using public transportation, and supporting sustainable practices. Despite growing awareness, progress has been slow. Economic interests, political challenges, and misinformation have hindered large-scale action. However, youth movements and climate activists have brought renewed attention to the issue, demanding that governments and corporations take responsibility. Ultimately, addressing climate change requires coordinated global efforts. The actions taken today will determine the quality of life for future generations, making it one of the most pressing issues of our time.",
    questions: [
      {
        q: "1. What is the main idea of the passage?",
        options: ["A. The effects of weather on agriculture", "B. Strategies for saving electricity", "C. Climate change as a global threat", "D. Tree planting campaigns"],
        answer: "C"
      },
      {
        q: "2. Which of the following contributes MOST to greenhouse gas emissions?",
        options: ["A. Planting trees", "B. Riding bicycles", "C. Burning fossil fuels", "D. Using solar panels"],
        answer: "C"
      },
      {
        q: "3. The word 'mitigation' in the passage is closest in meaning to:",
        options: ["A. Increase", "B. Prevention", "C. Reduction", "D. Agreement"],
        answer: "C"
      },
      {
        q: "4. What does the passage suggest about sea levels?",
        options: ["A. They are not affected by climate change", "B. They are rising due to melting ice", "C. They are dropping due to evaporation", "D. They stay constant"],
        answer: "B"
      },
      {
        q: "5. Which is NOT listed as a renewable energy source in the passage?",
        options: ["A. Solar", "B. Wind", "C. Hydroelectric", "D. Natural Gas"],
        answer: "D"
      },
      {
        q: "6. What is the author's attitude toward current climate action?",
        options: ["A. Optimistic", "B. Disappointed but hopeful", "C. Unconcerned", "D. Satisfied"],
        answer: "B"
      },
      {
        q: "7. Why is deforestation harmful, according to the passage?",
        options: ["A. It creates jobs", "B. It reduces carbon absorption", "C. It produces oxygen", "D. It causes wildfires"],
        answer: "B"
      },
      {
        q: "8. What can individuals do to fight climate change?",
        options: ["A. Avoid all technology", "B. Drive more often", "C. Use public transportation", "D. Ignore government policies"],
        answer: "C"
      },
      {
        q: "9. The phrase 'coordinated global efforts' suggests:",
        options: ["A. Countries acting alone", "B. Worldwide collaboration", "C. Ignoring international rules", "D. Corporate independence"],
        answer: "B"
      },
      {
        q: "10. According to the passage, what group has increased pressure for climate action?",
        options: ["A. Oil companies", "B. Scientists", "C. Youth activists", "D. Meteorologists"],
        answer: "C"
      }
    ]
  };
  res.json({ passages: [passage] });
});

// 4. Submit Reading
app.post('/api/submit-reading', (req, res) => {
  const { answers } = req.body;
  // TODO: compare answers to correct ones, return score
  res.json({ score: 25 });
});

// 5. Listening Audio URL
app.get('/api/listening-audio', (req, res) => {
  res.json({ audioUrl: `${req.protocol}://${req.get('host')}/listening.mp3` });
});

// 6. Listening Questions
app.get('/api/listening-questions', (req, res) => {
  const questions = [
    {
      q: "1. Why does Dr. Burnham discuss the case of Macquarie Island?",
      options: ["A. To illustrate how interrelated species prey on each other", "B. To explain the history of the island's unique ecosystem", "C. To show how human interference can damage nature"],
      answer: "C"
    },
        {
      q: "2. Why was myxomatosis introduced by scientists?",
      options: ["A. To reduce the population of rabbits on the island", "B. as a pesticide to protect the island's plant life", "C. To wipe out the rodents that reached the shore"],
      answer: "A"
    },
        {
      q: "3. What was the effect of wiping out the cats",
      options: ["A. birds were able to nest in the ground", "B. Rabbits reproduces at a repid rate", "C. A whole species became extinct"],
      answer: "B"
    },
        {
      q: "4. Why is the removal of an alien species dangerouse?",
      options: ["A. It causes the collapse of all ecosystems", "B. It leads to destruction of vagetetion", "C. It asversely affects a food chain"],
      answer: "C"
    },
    {
      q: "5. What de we learn from the research on Macquarie Island?",
      options: ["A. Reparing damage to the environment is costly", "B. Human intervention requores careful planning", "C. Conservation efforts have been wasted"],
      answer: "B"
    },
    // You can add more questions here as needed
  ];
  res.json({ questions });
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
