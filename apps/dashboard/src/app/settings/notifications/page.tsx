"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { loadSetting, saveSetting } from "@/lib/settings-storage";
import { ChannelsSection } from "./components/channels-section";
import { EmailSection, PushSection } from "./components/email-push-sections";
import { FrequencySection } from "./components/frequency-section";
import {
  DEFAULT_NOTIFICATIONS,
  type NotificationsFormValues,
  notificationsFormSchema,
} from "./components/notifications-schema";
import { PreferencesTable } from "./components/preferences-table";

const NOTIFICATIONS_STORAGE_KEY = "getlib-notifications";

export default function NotificationSettings() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: loadSetting(
      NOTIFICATIONS_STORAGE_KEY,
      notificationsFormSchema,
      DEFAULT_NOTIFICATIONS,
    ),
  });

  function onSubmit(data: NotificationsFormValues) {
    saveSetting(NOTIFICATIONS_STORAGE_KEY, data);
    toast.success("Notification preferences saved");
  }

  return (
    <BaseLayout>
      <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <EmailSection form={form} />
              <PushSection form={form} />
            </div>
            <FrequencySection form={form} />
            <PreferencesTable form={form} />
            <ChannelsSection form={form} />

            <div className="flex space-x-2">
              <Button type="submit" className="cursor-pointer">
                Save Preferences
              </Button>
              <Button variant="outline" type="reset" className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </BaseLayout>
  );
}
