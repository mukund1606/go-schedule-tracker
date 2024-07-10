"use client";
import { useState } from "react";

import { DataCard } from "@/components/DataCard";
import ReverseClock from "@/components/reverseClock";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api } from "@/trpc/react";

import dayjs from "dayjs";

import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import AddScheduleForm from "@/components/AddScheduleForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { quotes } from "@/data/quotes";
import ClipLoader from "react-spinners/ClipLoader";

export default function Home() {
  const [calendarDate, setCalendarDate] = useState<Date>(dayjs().toDate());
  const date = dayjs(calendarDate).format("MMMM DD, YYYY");
  const apiUtils = api.useUtils();
  const { data: allSchedules, isLoading } =
    api.schedule.getAllSchedules.useQuery();
  const scheduleData = allSchedules?.filter((data) =>
    dayjs(data.date).isSame(dayjs(date)),
  );
  const { mutateAsync: deleteScheduleAsync, isPending: isDeleting } =
    api.schedule.deleteSchedule.useMutation({
      async onSuccess() {
        await apiUtils.schedule.getSchedule.invalidate();
        await apiUtils.schedule.getAllSchedules.invalidate();
      },
    });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-[5.5rem] ml-auto h-fit w-fit p-2"
          >
            <PlusIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
          </DialogHeader>
          <AddScheduleForm />
        </DialogContent>
      </Dialog>
      <h2 className="bg-gradient-to-r from-violet-200 to-pink-200 bg-clip-text py-2 text-center text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
        Manage Schedule
      </h2>
      <div className="my-auto flex flex-col items-center gap-4">
        <h2 className="bg-gradient-to-r from-violet-200 to-pink-200 bg-clip-text py-2 text-center text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
          {date}
        </h2>
        <div>
          {isLoading ? (
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <ClipLoader
                color={"#ffffff"}
                loading={true}
                size={40}
                aria-label="Loading"
              />
              Loading schedule...
            </div>
          ) : (
            <Tabs
              defaultValue="CSE"
              className="max-h-[470px] min-w-[350px] max-w-[400px] overflow-y-auto p-2"
            >
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setCalendarDate((prev) =>
                      dayjs(prev).subtract(1, "day").toDate(),
                    )
                  }
                  variant="outline"
                  size="icon"
                  className="h-fit w-fit p-2"
                >
                  <ChevronLeft />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-fit w-fit p-2"
                    >
                      <CalendarIcon className="h-6 w-6" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={calendarDate}
                      onSelect={(d) => {
                        if (d) {
                          setCalendarDate(d);
                        }
                      }}
                      fixedWeeks
                    />
                  </PopoverContent>
                </Popover>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="CSE">CSE</TabsTrigger>
                  <TabsTrigger value="DA">DA</TabsTrigger>
                </TabsList>
                <Button
                  onClick={() =>
                    setCalendarDate((prev) =>
                      dayjs(prev).add(1, "day").toDate(),
                    )
                  }
                  variant="outline"
                  size="icon"
                  className="h-fit w-fit p-2"
                >
                  <ChevronRight />
                </Button>
              </div>
              {scheduleData?.length === 0 && quotes.length > 0 && (
                <Card className="my-2 max-w-[350px]">
                  <CardHeader></CardHeader>
                  <CardContent>
                    <h2 className="text-center text-2xl font-bold">
                      {quotes[Math.floor(Math.random() * quotes.length)]}
                    </h2>
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              )}
              <TabsContent value="CSE">
                <div className="flex flex-col gap-2">
                  {scheduleData
                    ?.filter((data) => data.courses.includes("CSE"))
                    .map((data) => (
                      <div key={data.id} className="relative">
                        <DataCard data={data} />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="absolute right-2 top-2 h-fit w-fit p-2"
                              size="icon"
                              variant="destructive"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="flex flex-col gap-2">
                            Are you sure you want to delete this schedule?
                            <Button
                              variant="destructive"
                              className="gap-2"
                              disabled={isDeleting}
                              onClick={() =>
                                deleteScheduleAsync({
                                  id: data.id,
                                })
                              }
                            >
                              <ClipLoader
                                color={"#ffffff"}
                                loading={isDeleting}
                                size={20}
                                aria-label="Loading"
                              />{" "}
                              Confirm
                            </Button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="DA">
                <div className="flex flex-col gap-2">
                  {scheduleData
                    ?.filter((data) => data.courses.includes("DA"))
                    .map((data) => (
                      <div key={data.id}>
                        <DataCard data={data} />
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-center text-xl font-medium text-white/80 lg:text-2xl">
          {"Don't forget today's day ends in"}
        </h3>
        <ReverseClock />
      </div>
    </>
  );
}
