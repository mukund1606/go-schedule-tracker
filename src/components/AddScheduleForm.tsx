"use client";
import { useEffect, useState } from "react";

import { TRPCClientError } from "@trpc/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { type z } from "zod";

import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { api } from "@/trpc/react";

import { cn } from "@/lib/utils";

import { CreateScheduleSchema } from "@/types";

import dayjs from "dayjs";

import ClipLoader from "react-spinners/ClipLoader";

export default function AddScheduleForm() {
  const [calendarDate, setCalendarDate] = useState<Date>(dayjs().toDate());

  const [isOpen, setIsOpen] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [subjects, setSubjects] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  const { data: subjectsData, refetch: refetchSubjects } =
    api.schedule.getSubjects.useQuery(undefined, {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    });

  const form = useForm<z.infer<typeof CreateScheduleSchema>>({
    resolver: zodResolver(CreateScheduleSchema),
    defaultValues: {
      course: "CSE",
      subjectName: "",
      description: "",
      workToDo: "",
      date: dayjs(calendarDate).format("MMMM DD, YYYY"),
    },
  });
  useEffect(() => {
    if (subjectsData) {
      setSubjects(subjectsData);
    }
  }, [subjectsData]);

  const apiUtils = api.useUtils();
  const addScheduleRoute = api.schedule.addSchedule.useMutation({
    async onSuccess() {
      await apiUtils.schedule.getSchedule.invalidate();
      await apiUtils.schedule.getAllSchedules.invalidate();
      await refetchSubjects();
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
              <div>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        type="button"
                        role="combobox"
                        className={cn(
                          "w-[300px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                        onClick={() => {
                          setIsOpen(!isOpen);
                          setSelectedSubject(field.value);
                        }}
                      >
                        {field.value
                          ? subjects.find(
                              (subject) => subject.value === field.value,
                            )?.label
                          : "Select Subject"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="max-h-64 w-[300px] overflow-y-auto p-0">
                    <div>
                      <Input
                        placeholder="Search Subject..."
                        value={selectedSubject}
                        onChange={(e) => {
                          setSelectedSubject(e.target.value);
                        }}
                        autoFocus={false}
                      />
                      <div className="flex flex-col">
                        {subjects.filter((subject) =>
                          subject.label
                            .toLowerCase()
                            .includes(selectedSubject.toLowerCase()),
                        ).length === 0 && (
                          <>
                            <div className="rounded-md border py-2 text-center text-muted-foreground">
                              No Subject Found.
                            </div>
                            <div
                              className="cursor-pointer rounded-md border py-2 text-center text-muted-foreground"
                              onClick={() => {
                                setSubjects([
                                  ...subjects,
                                  {
                                    label: selectedSubject,
                                    value: selectedSubject,
                                  },
                                ]);
                                form.setValue("subjectName", selectedSubject);
                                setIsOpen(false);
                              }}
                            >
                              <span className="flex items-center justify-center gap-2">
                                <PlusIcon /> Add subject
                              </span>
                            </div>
                          </>
                        )}
                        {subjects
                          .filter((subject) =>
                            subject.label
                              .toLowerCase()
                              .includes(selectedSubject.toLowerCase()),
                          )
                          .map((subject) => (
                            <div
                              key={subject.value}
                              className="cursor-pointer rounded-md border py-2 text-center text-muted-foreground"
                              onClick={() => {
                                setIsOpen(false);
                                form.setValue("subjectName", subject.value);
                                setSelectedSubject(subject.value);
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <Check
                                  className={cn(
                                    "ml-2 h-4 w-4",
                                    subject.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {subject.label}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workToDo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work to do</FormLabel>
              <FormControl>
                <Input placeholder="Work to do" {...field} />
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
        <div className="grid grid-cols-2 items-end gap-2">
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courses</FormLabel>
                <Select
                  onValueChange={(e: unknown) => {
                    console.log(e);
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="DA">DA</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="gap-2"
            variant="secondary"
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
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selected Date: {field.value}</FormLabel>
              <FormControl>
                <div className="flex justify-center gap-2">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={(d) => {
                      if (d) {
                        setCalendarDate(d);
                        field.onChange(dayjs(d).format("MMMM DD, YYYY"));
                      }
                    }}
                    fixedWeeks
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
