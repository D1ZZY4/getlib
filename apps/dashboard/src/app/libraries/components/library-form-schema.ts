import { z } from "zod";

const optionalUrl = z
  .string()
  .refine((value) => value.length === 0 || /^https?:\/\/.+\..+/.test(value), {
    message: "Please enter a valid URL.",
  });

export const libraryFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  ecosystem: z.enum(["npm", "pypi", "github", "go", "crates", "generic"]),
  version: z.string().min(1, { message: "Please enter a version." }),
  repositoryUrl: z.string().url({ message: "Please enter a valid URL." }),
  branch: z.string().min(1, { message: "Please enter a branch." }),
  description: z.string().optional(),
  baseUrl: z.string().url({ message: "Please enter a valid base URL." }),
  displayUrl: optionalUrl,
  versionDetection: z.enum(["all", "pinned"]),
  includeFolders: z.array(z.string()),
  excludeFolders: z.array(z.string()),
  excludeFiles: z.array(z.string()),
  urlsToExclude: z.array(z.string()),
  urlFragments: z.enum(["drop", "keep"]),
  queryParameters: z.enum(["keep", "drop"]),
  aiRules: z.string().optional(),
  redirectUrl: optionalUrl,
  blockIndexing: z.boolean(),
});

export type LibraryFormValues = z.infer<typeof libraryFormSchema>;

export const DEFAULT_LIBRARY_VALUES: LibraryFormValues = {
  name: "",
  ecosystem: "npm",
  version: "",
  repositoryUrl: "",
  branch: "main",
  description: "",
  baseUrl: "",
  displayUrl: "",
  versionDetection: "all",
  includeFolders: ["docs"],
  excludeFolders: ["node_modules", "dist"],
  excludeFiles: [],
  urlsToExclude: [],
  urlFragments: "drop",
  queryParameters: "keep",
  aiRules: "",
  redirectUrl: "",
  blockIndexing: false,
};
