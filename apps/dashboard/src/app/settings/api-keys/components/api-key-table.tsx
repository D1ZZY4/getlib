"use client";

import { Ban, Copy, EllipsisVertical, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ApiKey, maskApiKey } from "./api-key-schema";

interface ApiKeyTableProps {
  keys: ApiKey[];
  onCopy: (entry: ApiKey) => void;
  onRegenerate: (id: string) => void;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ApiKeyTable({
  keys,
  onCopy,
  onRegenerate,
  onRevoke,
  onDelete,
}: ApiKeyTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Secret</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.length > 0 ? (
            keys.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">
                      {maskApiKey(entry.secret)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => onCopy(entry)}
                    >
                      <Copy className="size-4" />
                      <span className="sr-only">Copy {entry.name} secret</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground tabular-nums">
                  {entry.created}
                </TableCell>
                <TableCell>
                  <Badge variant={entry.revoked ? "destructive" : "secondary"}>
                    {entry.revoked ? "revoked" : "active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {!entry.revoked && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => onRegenerate(entry.id)}
                      >
                        <RotateCcw className="size-4" />
                        <span className="sr-only">Regenerate {entry.name}</span>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                        >
                          <EllipsisVertical className="size-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => onCopy(entry)}
                        >
                          <Copy className="mr-2 size-4" />
                          Copy Secret
                        </DropdownMenuItem>
                        {!entry.revoked && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onRevoke(entry.id)}
                          >
                            <Ban className="mr-2 size-4" />
                            Revoke Key
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer"
                          onClick={() => onDelete(entry.id)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Delete Key
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No API keys yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
