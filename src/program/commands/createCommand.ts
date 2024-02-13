import { Command } from "@commander-js/extra-typings";
import { ModeOption } from "../../types/modeOptions";

export const createCommand = new Command<
	[string],
	{
		template?: string;
		mode?: ModeOption;
	}
>("create");
