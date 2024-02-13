import { Command } from "@commander-js/extra-typings";
import { packageVersion } from "../constants/packageVersion";
import { errorColor } from "../util/errorColor";
import { createCommandAction } from "./actions/createCommandAction";
import { targetArgument } from "./arguments/targetArgument";
import { createCommand } from "./commands/createCommand";
import { modeOption } from "./options/modeOption";
import { templateOption } from "./options/templateOption";

export function makeProgram() {
  const program = new Command();
  program
    .name("create-breadboard")
    .description("A cli for creating Breadboard based applications")
    .version(packageVersion);

  program.configureOutput({
    // writeOut: (str) => process.stdout.write(str),
    // writeErr: (str) => process.stdout.write(colourText(str, fgColour.red)),
    // Highlight errors in color.
    outputError: (str, write) => write(errorColor(str)),
  });

  createCommand.addOption(templateOption);
  createCommand.addOption(modeOption);
  createCommand.addArgument(targetArgument);
  createCommand.action(createCommandAction);

  program.addCommand(createCommand, {
    isDefault: true,
  });

  program.showHelpAfterError();
  program.configureHelp({
    sortSubcommands: true,
    showGlobalOptions: true,
    sortOptions: true,
  });
  return program;
}
