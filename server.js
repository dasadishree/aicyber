require('dotenv').config();
const express= require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/summarize', async (req, res) => {
    const { metadata } = req.body;
    const response = await fetch('https://ai.hackclub.com/proxy/v1/chat/completions', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${process.env.HACKCLUB_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'qwen/qwen3-32b',
            messages: [
                {
                    role: "user",
                    content: "You are an expert in image metadata, forensics, and AI detection. A user uploaded an image and here is what was found in its metadata: ${metadata}. In 2-3 sentences, explain in simple plain English what this means and whether this image is likely AI generated. Be direct and clear."
                }
            ]
        })
    })

    const data = await response.json();
    const summary = data.choices[0].message.content;
    res.json({summary});
});

app.listen(3000, ()=>console.log('Server running on port 3000'));
