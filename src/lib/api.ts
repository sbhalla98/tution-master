import axios from './axios';

export async function getStudents() {
  return await axios.get('/api/get-students');
}

export async function getPayments() {
  return await axios.get('/api/get-payments');
}
