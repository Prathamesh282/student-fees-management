const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();

const supabase = createClient('https://mgtmzrchrmmixcbfkmkw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ndG16cmNocm1taXhjYmZrbWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjM4OTgsImV4cCI6MjA1Nzg5OTg5OH0.eAxV8aLuVEdX6zgmaAbe2-g-PZ_teEq-2UtQDnUIcGY');
app.use(express.json());
app.use(express.static('public'));

// Add student
app.post('/api/students', async (req, res) => {
  const { student_id, name, email, total_fees } = req.body;
  const { error } = await supabase
    .from('students')
    .insert([{ student_id, name, email, total_fees }]);
  if (error) res.status(500).send(error.message);
  else res.send('Student added');
});

// Add payment
app.post('/api/payments', async (req, res) => {
  const { student_id, amount, payment_date } = req.body;
  const { error } = await supabase
    .from('payments')
    .insert([{ student_id, amount, payment_date }]);
  if (error) res.status(500).send(error.message);
  else res.send('Payment recorded');
});

// Get student fees
app.get('/api/students/:student_id', async (req, res) => {
  const { student_id } = req.params;
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('total_fees')
    .eq('student_id', student_id)
    .single();
  if (studentError || !student) return res.status(404).send('Student not found');

  const { data: payments, error: paymentError } = await supabase
    .from('payments')
    .select('amount')
    .eq('student_id', student_id);
  if (paymentError) return res.status(500).send(paymentError.message);

  const paid = payments.reduce((sum, p) => sum + p.amount, 0);
  res.json({ total: student.total_fees, paid, outstanding: student.total_fees - paid });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
