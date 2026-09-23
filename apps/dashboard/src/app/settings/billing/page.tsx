"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { BaseLayout } from "@/components/layouts/base-layout";
import { PricingPlans } from "@/components/pricing-plans";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadSetting, saveSetting } from "@/lib/settings-storage";
import { BillingHistoryCard } from "./components/billing-history-card";
import { CurrentPlanCard } from "./components/current-plan-card";
import billingHistoryData from "./data/billing-history.json";
// Import data
import currentPlanData from "./data/current-plan.json";

const BILLING_PLAN_STORAGE_KEY = "getlib-billing-plan";
const BillingPlanSchema = z.object({ planId: z.string().min(1) });

export default function BillingSettings() {
  const [currentPlanId, setCurrentPlanId] = useState(
    () =>
      loadSetting(BILLING_PLAN_STORAGE_KEY, BillingPlanSchema, {
        planId: "professional",
      }).planId,
  );

  const handlePlanSelect = (planId: string) => {
    setCurrentPlanId(planId);
    saveSetting(BILLING_PLAN_STORAGE_KEY, { planId });
    toast.success("Billing plan saved");
  };

  return (
    <BaseLayout>
      <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Plans & Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing information.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <CurrentPlanCard plan={currentPlanData} />
          <BillingHistoryCard history={billingHistoryData} />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose a plan that works best for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PricingPlans
                mode="billing"
                currentPlanId={currentPlanId}
                onPlanSelect={handlePlanSelect}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
}
