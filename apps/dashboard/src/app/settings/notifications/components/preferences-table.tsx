"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NotificationsFormValues } from "./notifications-schema";

type ChannelField =
  | "orderUpdatesEmail"
  | "orderUpdatesBrowser"
  | "orderUpdatesApp"
  | "invoiceRemindersEmail"
  | "invoiceRemindersBrowser"
  | "invoiceRemindersApp"
  | "promotionalOffersEmail"
  | "promotionalOffersBrowser"
  | "promotionalOffersApp"
  | "systemMaintenanceEmail"
  | "systemMaintenanceBrowser"
  | "systemMaintenanceApp";

function ChannelCheckbox({
  form,
  name,
}: {
  form: UseFormReturn<NotificationsFormValues>;
  name: ChannelField;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

const ROWS: { label: string; fields: [ChannelField, ChannelField, ChannelField] }[] = [
  {
    label: "Order updates",
    fields: ["orderUpdatesEmail", "orderUpdatesBrowser", "orderUpdatesApp"],
  },
  {
    label: "Invoice reminders",
    fields: ["invoiceRemindersEmail", "invoiceRemindersBrowser", "invoiceRemindersApp"],
  },
  {
    label: "Promotional offers",
    fields: ["promotionalOffersEmail", "promotionalOffersBrowser", "promotionalOffersApp"],
  },
  {
    label: "System maintenance",
    fields: ["systemMaintenanceEmail", "systemMaintenanceBrowser", "systemMaintenanceApp"],
  },
];

export function PreferencesTable({
  form,
}: {
  form: UseFormReturn<NotificationsFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          We need permission from your browser to show notifications.{" "}
          <Button variant="link" className="p-0 h-auto text-primary">
            Request Permission
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">TYPE</TableHead>
                <TableHead className="text-center">EMAIL</TableHead>
                <TableHead className="text-center">BROWSER</TableHead>
                <TableHead className="text-center">APP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="font-medium">{row.label}</TableCell>
                  {row.fields.map((field) => (
                    <TableCell key={field} className="text-center">
                      <ChannelCheckbox form={form} name={field} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <FormField
            control={form.control}
            name="notificationTiming"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When should we send you notifications?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online">Only When I&apos;m online</SelectItem>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
