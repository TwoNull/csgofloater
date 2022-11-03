import { mainMenuPrompt, logo } from "./src/interface/interface";
import fs from "fs";

async function main() {
  if (!fs.existsSync("/data")) {
    fs.mkdirSync("/data");
  }
  logo();
  const selection = await mainMenuPrompt();
  if (selection === "Quit") {
    return;
  }
  if (selection === "Steam Marketplace") {
  }
  main();
}

main();
