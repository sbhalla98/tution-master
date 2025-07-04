import axios from './axios';

export async function getStudents() {
  const res = await axios.get('/api/get-students');
  return res.data;
}

export async function getPayments() {
  const res = await axios.get('/api/get-payments');
  return res.data;
}
