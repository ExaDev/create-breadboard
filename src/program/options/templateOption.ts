import { Option } from "@commander-js/extra-typings";
import { samplesDir } from "../../constants/samplesDir";
import { getAvailableTemplateNames } from "../../util/getAvailableTemplateNames";


export const templateOption = new Option(
  "-t, --template <template>",
  "Template"
).choices(getAvailableTemplateNames(samplesDir));
