import { z } from 'zod';

export const reminderSchema = z.object({
  selectedId: z.string().optional(),
  message: z.string().min(10, 'Message is too short'),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
