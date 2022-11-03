//@ts-ignore
import { Input, Select, MultiSelect, Form } from "enquirer";
import emoji from "node-emoji";
import chalk from "chalk";

export async function mainMenuPrompt() {
  logo();
  const queryMainMenu = new Select({
    message: "Welcome, Choose your next move:\n",
    choices: [
      {
        name: "Scrape Skins",
        message: chalk.black("Scrape Skins"),
        role: "separator",
        choices: [
          { name: "Steam Marketplace", disabled: true },
          { name: "FloatDB", disabled: true },
          { name: "Inventory Crawler", disabled: true },
        ],
      },
      { name: "Calculate Floats", disabled: true },
      { name: "Automate Buying", disabled: true },
      { name: "Quit" },
    ],
  });
  const answer = await queryMainMenu.run();
  return answer;
}

export async function calculatePrompt() {}

export function logo() {
  console.clear();
  console.log(
    chalk.magenta(
      "███████╗██╗░░░░░░█████╗░░█████╗░████████╗███████╗██████╗░\n" +
        "██╔════╝██║░░░░░██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗\n" +
        "█████╗░░██║░░░░░██║░░██║███████║░░░██║░░░█████╗░░██████╔╝\n" +
        "██╔══╝░░██║░░░░░██║░░██║██╔══██║░░░██║░░░██╔══╝░░██╔══██╗\n" +
        "██║░░░░░███████╗╚█████╔╝██║░░██║░░░██║░░░███████╗██║░░██║\n" +
        "╚═╝░░░░░╚══════╝░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝ "
    ) +
      chalk.bold("V. 0.1.0") +
      " " +
      emoji.get("purple_heart") +
      "\n"
  );
}
