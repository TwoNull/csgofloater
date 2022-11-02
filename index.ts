import { mainMenuPrompt, logo } from "./src/interface/interface";

async function main() {
    logo()
    const selection = await mainMenuPrompt()
}

main()