import { z } from 'zod';

export const reminderSchema = z.object({
  message: z.string().min(10, 'Message is too short'),
  selectedId: z.string().optional(),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
