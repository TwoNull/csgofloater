//@ts-ignore
import { Input, Select } from "enquirer";
import emoji from "node-emoji";
import chalk from "chalk";

export async function collectionPrompt(collections: any) {
  let choicesArr: any;
  let collection: any;
  choicesArr = [];
  for (collection in collections) {
    choicesArr.push({
      message: collections[collection].name,
      value: collections[collection],
    });
  }
  logo();
  const query = new Select({
    message:
      chalk.bold("First, Choose a CS:GO Skin Collection:\n  ") +
      chalk.gray("(Scroll Up or Down for More Options)\n"),
    choices: choicesArr,
    limit: 25,
  });
  const answer = await query.run();
  return answer;
}

export async function qualityPrompt(collection: any) {
  let choicesArr: any;
  let quality: any;
  choicesArr = [];
  for (quality in collection.skins) {
    if (quality == 1) {
      choicesArr.push({
        message: "Consumer Grade",
        value: collection.skins[quality],
      });
    }
    if (quality == 2) {
      choicesArr.push({
        message: chalk.gray("Industrial Grade"),
        value: collection.skins[quality],
      });
    }
    if (quality == 4) {
      choicesArr.push({
        message: chalk.cyan("Mil-Spec Grade"),
        value: collection.skins[quality],
      });
    }
    if (quality == 6) {
      choicesArr.push({
        message: chalk.blue("Restricted"),
        value: collection.skins[quality],
      });
    }
    if (quality == 8) {
      choicesArr.push({
        message: chalk.magenta("Classified"),
        value: collection.skins[quality],
      });
    }
    if (quality == 10) {
      choicesArr.push({
        message: chalk.red("Covert"),
        value: collection.skins[quality],
      });
    }
  }
  choicesArr.push({ message: "<-- back", value: 11 });
  choicesArr.shift();
  logo();
  const query = new Select({
    message: chalk.bold(
      "Choose a Weapon Quality from " +
        chalk.cyan(collection.name) +
        " to Trade Up to:\n  "
    ),
    choices: choicesArr,
    limit: 25,
  });
  const answer = await query.run();
  return answer;
}

export async function skinPrompt(quality: any) {
  let choicesArr: any;
  let skin: any;
  choicesArr = [];
  for (skin in quality) {
    choicesArr.push({
      message: colorize(quality[skin].name, quality[skin].quality),
      value: quality[skin],
    });
  }
  choicesArr.push({ message: "<-- back", value: 11 });
  logo();
  const query = new Select({
    message: chalk.bold("Choose a Weapon Skin:\n  "),
    choices: choicesArr,
    limit: 25,
  });
  const answer = await query.run();
  return answer;
}

export async function floatPrompt(skin: any) {
  logo();
  const query = new Input({
    message:
      "Enter your desired float for your " +
      colorize(skin.name, skin.quality) +
      ":\n",
    initial: "0.0133742069",
    validate: function (answer: string) {
      const floatAnswer = parseFloat(answer);
      if (isNaN(floatAnswer)) {
        return "Must Be a Float Value";
      }
      if (floatAnswer < skin.minwear) {
        return "This Value is Below the Skin's Minimum Possible Wear Value";
      }
      if (floatAnswer > skin.maxwear) {
        return "This Value is Above the Skin's Maximum Possible Wear Value";
      }
      return true;
    },
  });
  const answer = await query.run();
  return parseFloat(answer);
}

export async function guardCodePrompt(type: any) {
  const query = new Input({
    message:
      chalk.yellow(`Enter the 5 Digit Code from your ${type} `) + emoji.get('construction'),
    initial: "XXXXX",
    validate: function (answer: string) {
      if(answer.length != 5) {
        return 'The Steam Guard code must be 5 digits!'
      }
      return true;
    },
  });
  const answer = await query.run();
  return answer;
}

export async function continuePrompt() {
  const query = new Select({
    message: "Continue to Buy Screen?\n  ",
    choices: [{message: chalk.green('Yes'), value: true}, {message: chalk.red('No'), value: false}],
  });
  const answer = await query.run();
  return answer;
}

export async function buyPrompt(price: number, numSkins: number) {
  const query = new Select({
    message: "Buy " + chalk.bold(numSkins) + " Skins for " + chalk.bold(`$${price.toFixed(2)}`) + "?\n  ",
    choices: [{message: chalk.green('Yes'), value: true}, {message: chalk.red('No'), value: false}],
  });
  const answer = await query.run();
  return answer;
}

export function logo() {
  console.clear();
  console.log(
    chalk.gray(
        "███████╗██╗░░░░░░█████╗░░█████╗░████████╗███████╗██████╗░\n" +
        "██╔════╝██║░░░░░██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗\n" +
        "█████╗░░██║░░░░░██║░░██║███████║░░░██║░░░█████╗░░██████╔╝\n" +
        "██╔══╝░░██║░░░░░██║░░██║██╔══██║░░░██║░░░██╔══╝░░██╔══██╗\n" +
        "██║░░░░░███████╗╚█████╔╝██║░░██║░░░██║░░░███████╗██║░░██║\n" +
        "╚═╝░░░░░╚══════╝░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝ "
    ) +
      chalk.bold("Copyright © 2022 0xDarkTwo") +
      " " +
      emoji.get("writing_hand") +
      "\n"
  );
}

export function colorize(string: any, quality: number) {
  if (quality == 1) {
    return string;
  }
  if (quality == 2) {
    return chalk.gray(string);
  }
  if (quality == 4) {
    return chalk.cyan(string);
  }
  if (quality == 6) {
    return chalk.blue(string);
  }
  if (quality == 8) {
    return chalk.magenta(string);
  }
  if (quality == 10) {
    return chalk.red(string);
  }
}
