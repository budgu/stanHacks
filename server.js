const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your existing HTML, JS, CSS files

const db = new sqlite3.Database('./flashcards.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});

// Create table (if not exists)
db.run('CREATE TABLE IF NOT EXISTS flashcards (setName TEXT, question TEXT, answer TEXT)');

// Endpoint to add a flashcard
app.post('/addFlashcard', (req, res) => {
  const { setName, question, answer } = req.body;
  const sql = `INSERT INTO flashcards (setName, question, answer) VALUES (?, ?, ?)`;
  db.run(sql, [setName, question, answer], (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.send('Flashcard added successfully!');
  });
});

// Endpoint to get all flashcard sets
app.get('/flashcardSets', (req, res) => {
    const sql = 'SELECT DISTINCT setName FROM flashcards';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows.map(row => row.setName));
    });
});

// Endpoint to get flashcards by set name
app.get('/getFlashcards/:setName', (req, res) => {
    const sql = 'SELECT question, answer FROM flashcards WHERE setName = ?';
    db.all(sql, [req.params.setName], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows);
    });
});


// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
