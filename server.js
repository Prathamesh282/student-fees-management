const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./fees.db');

app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE,
    name TEXT,
    email TEXT,
    total_fees REAL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    amount REAL,
    payment_date TEXT
  )`);
});

// API: Add student
app.post('/api/students', (req, res) => {
  const { student_id, name, email, total_fees } = req.body;
  db.run(
    'INSERT INTO students (student_id, name, email, total_fees) VALUES (?, ?, ?, ?)',
    [student_id, name, email, total_fees],
    (err) => {
      if (err) res.status(500).send(err);
      else res.send('Student added');
    }
  );
});

// API: Add payment
app.post('/api/payments', (req, res) => {
  const { student_id, amount, payment_date } = req.body;
  db.run(
    'INSERT INTO payments (student_id, amount, payment_date) VALUES (?, ?, ?)',
    [student_id, amount, payment_date],
    (err) => {
      if (err) res.status(500).send(err);
      else res.send('Payment recorded');
    }
  );
});

// API: Get student fees
app.get('/api/students/:student_id', (req, res) => {
  const { student_id } = req.params;
  db.get('SELECT total_fees FROM students WHERE student_id = ?', [student_id], (err, student) => {
    if (err || !student) res.status(404).send('Student not found');
    else {
      db.all('SELECT amount FROM payments WHERE student_id = ?', [student_id], (err, payments) => {
        const paid = payments.reduce((sum, p) => sum + p.amount, 0);
        res.json({ total: student.total_fees, paid, outstanding: student.total_fees - paid });
      });
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));