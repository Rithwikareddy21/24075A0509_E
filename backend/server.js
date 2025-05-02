const express = require('express');
const cors = require('cors');
const fs = require('fs');
const levenshtein = require('fast-levenshtein');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Load dictionary
const dictionary = fs.readFileSync('dictionary.txt', 'utf-8').split('\n').map(w => w.trim().toLowerCase());

// APIs
app.post('/check', (req, res) => {
    const { word } = req.body;
    const lowerWord = word.toLowerCase();

    if (dictionary.includes(lowerWord)) {
        return res.json({ correct: true });
    } else {
        let nearest = '';
        let minDistance = Infinity;
        for (let dictWord of dictionary) {
            const dist = levenshtein.get(lowerWord, dictWord);
            if (dist < minDistance) {
                minDistance = dist;
                nearest = dictWord;
            }
        }
        return res.json({ correct: false, suggestion: nearest });
    }
});

app.get('/histogram', (req, res) => {
    const lengthHistogram = {};
    const startingLetterHistogram = {};

    dictionary.forEach(word => {
        const len = word.length;
        lengthHistogram[len] = (lengthHistogram[len] || 0) + 1;

        const first = word[0];
        startingLetterHistogram[first] = (startingLetterHistogram[first] || 0) + 1;
    });

    res.json({ lengthHistogram, startingLetterHistogram });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));