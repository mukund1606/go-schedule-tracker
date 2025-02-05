"use client";

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

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { quotes } from "@/data/quotes";
import ClipLoader from "react-spinners/ClipLoader";

import {
  parseAsIsoDateTime,
  parseAsStringLiteral,
  useQueryState,
} from "next-usequerystate";

export default function HomePage() {
  const [course, setCourse] = useQueryState(
    "course",
    parseAsStringLiteral(["CSE", "DA"] as const).withDefault("CSE"),
  );
  const [calendarDate, setCalendarDate] = useQueryState(
    "date",
    parseAsIsoDateTime.withDefault(
      dayjs()
        .set("hour", 0)
        .set("minute", 0)
        .set("seconds", 0)
        .set("millisecond", 0)
        .toDate(),
    ),
  );

  const date = dayjs(calendarDate).format("MMMM DD, YYYY");
  const { data: scheduleData, isLoading } = api.schedule.getSchedule.useQuery({
    date: date,
  });
  const data = scheduleData?.filter((data) => data.course === course);

  return (
    <>
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
              defaultValue={course}
              className="max-h-[470px] min-w-[350px] max-w-[400px] overflow-y-auto p-2"
              onValueChange={(value) => {
                void setCourse(value as "CSE" | "DA");
              }}
            >
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    void setCalendarDate((prev) =>
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
                          void setCalendarDate(d);
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
              {data?.length === 0 && quotes.length > 0 && (
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
                  {data?.map((data) => <DataCard data={data} key={data.id} />)}
                </div>
              </TabsContent>
              <TabsContent value="DA">
                <div className="flex flex-col gap-2">
                  {data?.map((data) => <DataCard data={data} key={data.id} />)}
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
