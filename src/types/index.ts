import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const CourseEnum = z.enum(["CSE", "DA"], {
  message: "Please select a course",
});

export const CreateScheduleSchema = z.object({
  course: CourseEnum,
  subjectName: z.string().min(1, { message: "Please enter a subject name" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  workToDo: z.string().min(1, { message: "Please enter a duration" }),
  date: z.string().min(1, { message: "Please enter a date" }),
});
