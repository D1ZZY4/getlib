"use client";

import { Eye, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface TopLibraryRow {
  id: number;
  name: string;
  ecosystem: string;
  documents: number;
  chunks: number;
  coverage: number;
  delta: string;
}

export function TopProducts({
  title,
  description,
  libraries,
}: {
  title: string;
  description: string;
  libraries: TopLibraryRow[];
}) {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {libraries.map((library, index) => (
          <div
            key={library.id}
            className="flex items-center p-3 rounded-lg border gap-2"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              #{index + 1}
            </div>
            <div className="flex gap-2 items-center justify-between space-x-3 flex-1 flex-wrap">
              <div className="">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium truncate">{library.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {library.ecosystem}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {library.documents} documents
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {library.chunks} chunks
                  </span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">
                    {library.coverage}% indexed
                  </p>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 cursor-pointer"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {library.delta}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Coverage
                  </span>
                  <Progress value={library.coverage} className="w-12 h-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
