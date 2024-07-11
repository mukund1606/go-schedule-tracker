import type { AppRouterOutputTypes } from "@/server/api/root";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function DataCard({
  data,
  className,
}: {
  data: AppRouterOutputTypes["schedule"]["getSchedule"][0];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold">
          {data.subjectName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-center text-2xl font-bold">{data.workToDo}</h2>
        <CardDescription className="text-center">
          {data.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
