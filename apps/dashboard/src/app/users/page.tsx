"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BaseLayout } from "@/components/layouts/base-layout";
import { getInitials } from "@/lib/initials";
import { DataTable } from "./components/data-table";
import { StatCards } from "./components/stat-cards";
import {
  UserEditDialog,
  type UserFormValues,
} from "./components/user-form-dialog";

import initialUsersData from "./data.json";

interface User {
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

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsersData);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddUser = (userData: UserFormValues) => {
    const nextId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser: User = {
      id: nextId,
      name: userData.name,
      email: userData.email,
      avatar: getInitials(userData.name),
      role: userData.role,
      plan: userData.plan,
      billing: userData.billing,
      status: userData.status,
      joinedDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveEdit = (values: UserFormValues) => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? { ...user, ...values, avatar: getInitials(values.name) }
          : user,
      ),
    );
    setEditingUser(null);
    toast.success("User updated");
  };

  return (
    <BaseLayout
      title="Users"
      description="Manage your users and their permissions"
    >
      <div className="flex flex-col gap-4">
        <div className="@container/main px-4 lg:px-6">
          <StatCards users={users} />
        </div>

        <div className="@container/main px-4 lg:px-6 mt-8 lg:mt-12">
          <DataTable
            users={users}
            onDeleteUser={handleDeleteUser}
            onEditUser={handleEditUser}
            onAddUser={handleAddUser}
          />
          {editingUser && (
            <UserEditDialog
              key={editingUser.id}
              user={editingUser}
              onClose={() => setEditingUser(null)}
              onSave={handleSaveEdit}
            />
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
