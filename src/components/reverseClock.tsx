"use client";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
export default function ReverseClock() {
  const [timeDiff, setTimeDiff] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    function getTimeDiff() {
      const currendDay = dayjs();
      const nextDay = currendDay.endOf("day");
      let secondsDiff = nextDay.diff(currendDay, "seconds");
      const hoursDiff = Math.floor(secondsDiff / 3600);
      const minutesDiff = Math.floor((secondsDiff - hoursDiff * 3600) / 60);
      secondsDiff = secondsDiff - hoursDiff * 3600 - minutesDiff * 60;
      setTimeDiff({
        hours: hoursDiff,
        minutes: minutesDiff,
        seconds: secondsDiff,
      });
    }
    getTimeDiff();
    const interval = setInterval(() => {
      getTimeDiff();
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <p className="text-center text-3xl font-medium text-white/60 lg:text-4xl">
      {timeDiff.hours.toString().padStart(2, "0")}:
      {timeDiff.minutes.toString().padStart(2, "0")}:
      {timeDiff.seconds.toString().padStart(2, "0")}
    </p>
  );
}
