"use client";

import { Copy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BaseLayout } from "@/components/layouts/base-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadSetting, saveSetting } from "@/lib/settings-storage";
import { ApiKeyDialog } from "./components/api-key-dialog";
import {
  type ApiKey,
  apiKeysSchema,
  generateApiKeyId,
  generateApiSecret,
} from "./components/api-key-schema";
import { ApiKeyTable } from "./components/api-key-table";
import seedKeysJson from "./data/api-keys.json";

const API_KEYS_STORAGE_KEY = "getlib-api-keys";

const seedKeys: ApiKey[] = apiKeysSchema.parse(seedKeysJson);

function today(): string {
  const date = new Date().toISOString().split("T")[0];
  return date ?? "";
}

export default function ApiKeysSettings() {
  const [keys, setKeys] = useState<ApiKey[]>(() =>
    loadSetting(API_KEYS_STORAGE_KEY, apiKeysSchema, seedKeys),
  );
  const [revealed, setRevealed] = useState<{
    id: string;
    secret: string;
  } | null>(null);

  const persist = (next: ApiKey[]) => {
    setKeys(next);
    saveSetting(API_KEYS_STORAGE_KEY, next);
  };

  const handleCopy = (entry: ApiKey) => {
    try {
      void navigator.clipboard?.writeText(entry.secret)?.catch(() => undefined);
    } catch {
      // Clipboard unavailable: the secret stays visible for manual copy.
    }
    toast.success(`${entry.name} copied to clipboard`);
  };

  const handleCreate = (values: { name: string }) => {
    const entry: ApiKey = {
      id: generateApiKeyId(),
      name: values.name,
      secret: generateApiSecret(),
      created: today(),
      revoked: false,
    };
    persist([entry, ...keys]);
    setRevealed({ id: entry.id, secret: entry.secret });
    toast.success("API key created");
  };

  const handleRegenerate = (id: string) => {
    const next = keys.map((entry) =>
      entry.id === id && !entry.revoked
        ? { ...entry, secret: generateApiSecret() }
        : entry,
    );
    persist(next);
    const entry = next.find((item) => item.id === id);
    if (entry) setRevealed({ id: entry.id, secret: entry.secret });
    toast.success("API key regenerated");
  };

  const handleRevoke = (id: string) => {
    persist(
      keys.map((entry) =>
        entry.id === id ? { ...entry, revoked: true } : entry,
      ),
    );
    toast.success("API key revoked");
  };

  const handleDelete = (id: string) => {
    persist(keys.filter((entry) => entry.id !== id));
    if (revealed?.id === id) setRevealed(null);
    toast.success("API key deleted");
  };

  return (
    <BaseLayout
      title="API Keys"
      description="Create, copy, regenerate, and revoke access tokens"
    >
      <div className="@container/main px-4 lg:px-6 space-y-6">
        {revealed ? (
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle>New secret generated</CardTitle>
              <CardDescription>
                Copy the secret now. Afterwards only the masked form is shown.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-md border bg-muted px-3 py-2 font-mono text-xs">
                  {revealed.secret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    const entry = keys.find((item) => item.id === revealed.id);
                    if (entry) handleCopy(entry);
                  }}
                >
                  <Copy className="mr-2 size-4" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => setRevealed(null)}
                >
                  <X className="size-4" />
                  <span className="sr-only">Dismiss revealed secret</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex items-center justify-end">
          <ApiKeyDialog onCreate={handleCreate} />
        </div>

        <ApiKeyTable
          keys={keys}
          onCopy={handleCopy}
          onRegenerate={handleRegenerate}
          onRevoke={handleRevoke}
          onDelete={handleDelete}
        />
      </div>
    </BaseLayout>
  );
}
