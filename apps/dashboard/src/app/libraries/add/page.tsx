"use client";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BaseLayout } from "@/components/layouts/base-layout";
import { LibraryForm } from "../components/library-form";
import {
  DEFAULT_LIBRARY_VALUES,
  type LibraryFormValues,
} from "../components/library-form-schema";

export default function AddLibraryPage() {
  const navigate = useNavigate();

  function handleSubmit(data: LibraryFormValues) {
    toast.success(`Library ${data.name} registered for indexing`);
    navigate("/libraries");
  }

  return (
    <BaseLayout
      title="Add Library"
      description="Register a library, its sources, and indexing rules"
    >
      <div className="@container/main px-4 lg:px-6">
        <LibraryForm
          defaultValues={DEFAULT_LIBRARY_VALUES}
          submitLabel="Add Library"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/libraries")}
        />
      </div>
    </BaseLayout>
  );
}
