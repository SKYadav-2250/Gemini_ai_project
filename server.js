const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const path = require('path');  

const app = express();
app.use(express.json());
app.use(cors()); 

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));  // Serve files from the root directory

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/generate', async (req, res) => {
    const { message } = req.body;

    async function generateContent(prompt, retries = 3) {
        try {
            const result = await model.generateContent(prompt);
            return res.json({ response: result.response.text() });
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
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});