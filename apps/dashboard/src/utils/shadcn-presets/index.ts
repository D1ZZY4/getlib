import type { ThemePreset } from "../../types/theme";

import { shadcnChunkPart01 } from "./part-01";
import { shadcnChunkPart02 } from "./part-02";
import { shadcnChunkPart03 } from "./part-03";

export const shadcnThemePresets: Record<string, ThemePreset> = {
  ...shadcnChunkPart01,
  ...shadcnChunkPart02,
  ...shadcnChunkPart03,
};
