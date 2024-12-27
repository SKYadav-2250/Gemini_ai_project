const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/generate', async (req, res) => {
    const { message } = req.body;

    async function generateContent(prompt, retries = 3) {
        try {
            const result = await model.generateContent(prompt);
            return res.json({ response: result.response.text()});
        } catch (error) {
            if (error.status === 429 && retries > 0) {
                console.log('Rate limit exceeded. Retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                return generateContent(prompt, retries - 1);
            }
            console.error(error);
            return res.status(500).json({ error: 'Failed to generate content.' });
        }
    }

    await generateContent(message); 
}
);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
