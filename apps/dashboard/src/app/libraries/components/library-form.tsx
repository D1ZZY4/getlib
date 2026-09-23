import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  libraryFormSchema,
  type LibraryFormValues,
} from "./library-form-schema";
import { IdentitySection } from "./form-identity";
import { RepositorySection } from "./form-repository";
import { SourcesSection } from "./form-sources";
import { AdvancedSection, AiRulesSection } from "./form-advanced";

export function LibraryForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  defaultValues: LibraryFormValues;
  submitLabel: string;
  onSubmit: (data: LibraryFormValues) => void;
  onCancel: () => void;
}) {
  const form: UseFormReturn<LibraryFormValues> = useForm<LibraryFormValues>({
    resolver: zodResolver(libraryFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <IdentitySection form={form} />
        <RepositorySection form={form} />
        <SourcesSection form={form} />
        <AiRulesSection form={form} />
        <AdvancedSection form={form} />

        <div className="flex space-x-2">
          <Button type="submit" className="cursor-pointer">
            {submitLabel}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
