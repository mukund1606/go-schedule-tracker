"use client";
import { useState } from "react";

import { TRPCClientError } from "@trpc/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { z } from "zod";

import { CalendarIcon } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";
import { CreateScheduleSchema } from "@/types";
import dayjs from "dayjs";
import ClipLoader from "react-spinners/ClipLoader";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

export default function AddScheduleForm() {
  const [calendarDate, setCalendarDate] = useState<Date>(dayjs().toDate());
  const form = useForm<z.infer<typeof CreateScheduleSchema>>({
    resolver: zodResolver(CreateScheduleSchema),
    defaultValues: {
      courses: ["CSE"],
      subjectName: "",
      description: "",
      duration: "",
      date: dayjs(calendarDate).format("MMMM DD, YYYY"),
    },
  });

  const apiUtils = api.useUtils();
  const addScheduleRoute = api.schedule.addSchedule.useMutation({
    async onSuccess() {
      await apiUtils.schedule.getSchedule.invalidate();
      await apiUtils.schedule.getAllSchedules.invalidate();
    },
  });

  async function onSubmit(data: z.infer<typeof CreateScheduleSchema>) {
    try {
      const res = await addScheduleRoute.mutateAsync(data);
      toast.success(res.message);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast.error(err.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subjectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="Subject Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="Duration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? field.value : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={calendarDate}
                        onSelect={(d) => {
                          if (d) {
                            setCalendarDate(d);
                            field.onChange(dayjs(d).format("MMMM DD, YYYY"));
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="courses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Courses</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value.includes("CSE")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, "CSE"]);
                        } else {
                          field.onChange(
                            field.value.filter((c) => c !== "CSE"),
                          );
                        }
                      }}
                    />
                    CSE
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value.includes("DA")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, "DA"]);
                        } else {
                          field.onChange(field.value.filter((c) => c !== "DA"));
                        }
                      }}
                    />
                    DA
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="gap-2"
          disabled={addScheduleRoute.isPending}
        >
          <ClipLoader
            color="#ffffff"
            loading={addScheduleRoute.isPending}
            size={20}
            aria-label="Loading"
          />{" "}
          Create Schedule
        </Button>
      </form>
    </Form>
  );
}
