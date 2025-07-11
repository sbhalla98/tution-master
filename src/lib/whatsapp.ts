import { Payment } from '@/types';

export function generateWhatsappReminder(message: string, payment: Payment) {
  return `${message}

Payment Details:
- Student: ${payment.studentName}
- Month: ${payment.month} ${payment.year}
- Amount: ₹${payment.amount}
- Due Date: ${new Date(payment.dueDate).toLocaleDateString()}`;
}

export const sendWhatsappMessage = (phone: string, message: string) => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
};
