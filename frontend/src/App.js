import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [histogram, setHistogram] = useState({ lengthHistogram: {}, startingLetterHistogram: {} });

  const handleCheck = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const handleClear = () => {
    setWord('');
    setResult(null);
  };

  useEffect(() => {
    fetch('http://localhost:5000/histogram')
      .then(res => res.json())
      .then(data => setHistogram(data));
  }, []);

  return (
    <div className="container">
      <h1>Dictionary AutoCorrect</h1>
      <div className="input-group">
        <input 
          type="text" 
          value={word} 
          onChange={e => setWord(e.target.value)} 
          placeholder="Type a word..." 
        />
        <button onClick={handleCheck}>Check</button>
        <button onClick={handleClear} className="clear-btn">Clear</button>
      </div>

      {loading && <p className="loading">Checking...</p>}

      {result && !loading && (
        <div className={`result ${result.correct ? 'correct' : 'incorrect'}`}>
          {result.correct ? (
            <p>✅ Correct Word!</p>
          ) : (
            <p>❌ Incorrect. Did you mean: <strong>{result.suggestion}</strong>?</p>
          )}
        </div>
      )}

      <div className="histogram">
        <h2>Word Length Histogram</h2>
        <div className="histogram-list">
          {Object.keys(histogram.lengthHistogram).map(len => (
            <p key={len}>Length {len}: {histogram.lengthHistogram[len]} words</p>
          ))}
        </div>
        
        <h2>Starting Letter Histogram</h2>
        <div className="histogram-list">
          {Object.keys(histogram.startingLetterHistogram).map(letter => (
            <p key={letter}>'{letter.toUpperCase()}': {histogram.startingLetterHistogram[letter]} words</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;