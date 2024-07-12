import type { AppRouterOutputTypes } from "@/server/api/root";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
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
        <h2 className="text-center text-2xl font-bold">
          {data.url ? (
            <Link
              href={data.url}
              target="_blank"
              className="flex w-full items-start justify-center gap-2 hover:underline"
            >
              {data.workToDo}{" "}
              <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
            </Link>
          ) : (
            data.workToDo
          )}
        </h2>
        <CardDescription className="text-center">
          {data.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
