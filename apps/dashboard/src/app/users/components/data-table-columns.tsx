"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { exactMatchFilter } from "@/components/data-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { features } from "@/lib/table-features";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  plan: string;
  billing: string;
  status: string;
  joinedDate: string;
  lastLogin: string;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
    case "Pending":
      return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20";
    case "Error":
      return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
    default:
      return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case "Admin":
      return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20";
    case "Editor":
      return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
    case "Author":
      return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20";
    case "Maintainer":
      return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20";
    case "Subscriber":
      return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20";
    default:
      return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20";
  }
}

const columnHelper = createColumnHelper<typeof features, User>();

export interface UserColumnActions {
  onDeleteUser: (id: number) => void;
  onEditUser: (user: User) => void;
}

export function createUserColumns(actions: UserColumnActions) {
  return columnHelper.columns([
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-medium">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <Badge variant="secondary" className={getRoleColor(role)}>
            {role}
          </Badge>
        );
      },
      filterFn: exactMatchFilter,
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("plan")}</span>
      ),
      filterFn: exactMatchFilter,
    },
    {
      accessorKey: "billing",
      header: "Billing",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("billing")}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant="secondary" className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
      filterFn: exactMatchFilter,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
            >
              <Eye className="size-4" />
              <span className="sr-only">View user</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 cursor-pointer"
              onClick={() => actions.onEditUser(user)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Edit user</span>
            </Button>
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
                <DropdownMenuItem className="cursor-pointer">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => actions.onDeleteUser(user.id)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ]);
}
