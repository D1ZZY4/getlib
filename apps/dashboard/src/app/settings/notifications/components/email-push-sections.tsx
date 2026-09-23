"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import type { NotificationsFormValues } from "./notifications-schema";

function ToggleRow({
  form,
  name,
  title,
  description,
}: {
  form: UseFormReturn<NotificationsFormValues>;
  name:
    | "emailSecurity"
    | "emailUpdates"
    | "emailMarketing"
    | "pushMessages"
    | "pushMentions"
    | "pushTasks";
  title: string;
  description: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1">
            <FormLabel>{title}</FormLabel>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </FormItem>
      )}
    />
  );
}

export function EmailSection({
  form,
}: {
  form: UseFormReturn<NotificationsFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Choose what email notifications you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <ToggleRow
            form={form}
            name="emailSecurity"
            title="Security alerts"
            description="Get notified when there are security events on your account."
          />
          <ToggleRow
            form={form}
            name="emailUpdates"
            title="Product updates"
            description="Receive updates about new features and improvements."
          />
          <ToggleRow
            form={form}
            name="emailMarketing"
            title="Marketing emails"
            description="Receive emails about our latest offers and promotions."
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function PushSection({
  form,
}: {
  form: UseFormReturn<NotificationsFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Configure browser and mobile push notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <ToggleRow
            form={form}
            name="pushMessages"
            title="New messages"
            description="Get notified when you receive new messages."
          />
          <ToggleRow
            form={form}
            name="pushMentions"
            title="Mentions"
            description="Get notified when someone mentions you."
          />
          <ToggleRow
            form={form}
            name="pushTasks"
            title="Task updates"
            description="Get notified about task assignments and updates."
          />
        </div>
      </CardContent>
    </Card>
  );
}
