"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare } from "lucide-react";
import type { NotificationsFormValues } from "./notifications-schema";

function ChannelRow({
  form,
  name,
  icon: Icon,
  title,
  description,
}: {
  form: UseFormReturn<NotificationsFormValues>;
  name: "channelEmail" | "channelPush" | "channelSms";
  icon: typeof Mail;
  title: string;
  description: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <FormLabel className="font-medium mb-1">{title}</FormLabel>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          </div>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function ChannelsSection({
  form,
}: {
  form: UseFormReturn<NotificationsFormValues>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Channels</CardTitle>
        <CardDescription>
          Choose your preferred notification channels for different types of
          alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ChannelRow
            form={form}
            name="channelEmail"
            icon={Mail}
            title="Email"
            description="Receive notifications via email"
          />
          <Separator />
          <ChannelRow
            form={form}
            name="channelPush"
            icon={Bell}
            title="Push Notifications"
            description="Receive browser push notifications"
          />
          <Separator />
          <ChannelRow
            form={form}
            name="channelSms"
            icon={MessageSquare}
            title="SMS"
            description="Receive notifications via SMS"
          />
        </div>
      </CardContent>
    </Card>
  );
}
