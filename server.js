const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path'); // For reliable static file serving
const app = express();

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL and Key must be provided');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: Add a student (admin)
app.post('/api/students', async (req, res) => {
  const { student_id, name, email, total_fees } = req.body;
  if (!student_id || !name || !email || !total_fees) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { error } = await supabase
    .from('students')
    .insert([{ student_id, name, email, total_fees: parseFloat(total_fees) }]);
  if (error) {
    console.error('Error adding student:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ message: 'Student added successfully' });
});

// API: Add a payment (admin)
app.post('/api/payments', async (req, res) => {
  const { student_id, amount, payment_date } = req.body;
  if (!student_id || !amount || !payment_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { error } = await supabase
    .from('payments')
    .insert([{ student_id, amount: parseFloat(amount), payment_date }]);
  if (error) {
    console.error('Error adding payment:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ message: 'Payment recorded successfully' });
});

// API: Get student fees (student/admin)
app.get('/api/students/:student_id', async (req, res) => {
  const { student_id } = req.params;
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('total_fees')
    .eq('student_id', student_id)
    .single();
  if (studentError || !student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const { data: payments, error: paymentError } = await supabase
    .from('payments')
    .select('amount')
    .eq('student_id', student_id);
  if (paymentError) {
    console.error('Error fetching payments:', paymentError);
    return res.status(500).json({ error: paymentError.message });
  }

  const paid = payments ? payments.reduce((sum, p) => sum + p.amount, 0) : 0;
  const outstanding = student.total_fees - paid;
  res.json({ total: student.total_fees, paid, outstanding });
});

// Fallback for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
