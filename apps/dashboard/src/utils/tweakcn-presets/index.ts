import type { ThemePreset } from "../../types/theme";

import { tweakcnPresetsChunkPart01 } from "./part-01";
import { tweakcnPresetsChunkPart02 } from "./part-02";
import { tweakcnPresetsChunkPart03 } from "./part-03";
import { tweakcnPresetsChunkPart04 } from "./part-04";
import { tweakcnPresetsChunkPart05 } from "./part-05";
import { tweakcnPresetsChunkPart06 } from "./part-06";
import { tweakcnPresetsChunkPart07 } from "./part-07";
import { tweakcnPresetsChunkPart08 } from "./part-08";
import { tweakcnPresetsChunkPart09 } from "./part-09";
import { tweakcnPresetsChunkPart10 } from "./part-10";

export const tweakcnPresets: Record<string, ThemePreset> = {
  ...tweakcnPresetsChunkPart01,
  ...tweakcnPresetsChunkPart02,
  ...tweakcnPresetsChunkPart03,
  ...tweakcnPresetsChunkPart04,
  ...tweakcnPresetsChunkPart05,
  ...tweakcnPresetsChunkPart06,
  ...tweakcnPresetsChunkPart07,
  ...tweakcnPresetsChunkPart08,
  ...tweakcnPresetsChunkPart09,
  ...tweakcnPresetsChunkPart10,
};
