"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInitials } from "@/lib/initials";

export interface IndexJobRow {
  id: string;
  library: string;
  detail: string;
  status: "completed" | "running" | "failed";
  updated: string;
}

export function RecentTransactions({
  title,
  description,
  jobs,
}: {
  title: string;
  description: string;
  jobs: IndexJobRow[];
}) {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Badge variant="outline">
          {jobs.filter((job) => job.status === "running").length} running
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id}>
            <div className="flex p-3 rounded-lg border gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(job.library)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 items-center flex-wrap justify-between gap-1">
                <div className="flex items-center space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {job.library}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {job.detail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      job.status === "completed"
                        ? "default"
                        : job.status === "running"
                          ? "secondary"
                          : "destructive"
                    }
                    className="cursor-pointer"
                  >
                    {job.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">{job.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.updated}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
