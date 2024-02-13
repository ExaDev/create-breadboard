import { Option } from "@commander-js/extra-typings";
import { modeOptions, modeOptionsArray } from "../../types/modeOptions";


export const modeOption = new Option(
  "-m, --mode <mode>",
  "How to handle existing files in the target directory"
)
  .default(modeOptions.abort)
  .choices(modeOptionsArray);
