//@ts-ignore
import { Input, Select, MultiSelect, Form } from "enquirer";
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
      chalk.bold("First, choose a CS:GO skin collection:\n  ") +
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
  logo();
  const query = new Select({
    message: chalk.bold(
      "Choose a weapon quality from " + chalk.cyan(collection.name) + ":\n  "
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
    if (quality[skin].quality == 1) {
      choicesArr.push({ message: quality[skin].name, value: quality[skin] });
    }
    if (quality[skin].quality == 2) {
      choicesArr.push({
        message: chalk.gray(quality[skin].name),
        value: quality[skin],
      });
    }
    if (quality[skin].quality == 4) {
      choicesArr.push({
        message: chalk.cyan(quality[skin].name),
        value: quality[skin],
      });
    }
    if (quality[skin].quality == 6) {
      choicesArr.push({
        message: chalk.blue(quality[skin].name),
        value: quality[skin],
      });
    }
    if (quality[skin].quality == 8) {
      choicesArr.push({
        message: chalk.magenta(quality[skin].name),
        value: quality[skin],
      });
    }
    if (quality[skin].quality == 10) {
      choicesArr.push({
        message: chalk.red(quality[skin].name),
        value: quality[skin],
      });
    }
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
      "Enter your desired float for your " + chalk.cyan(skin.name) + ":\n",
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
      chalk.bold("Copyright © 2022 0xDarkTwo") +
      " " +
      emoji.get("purple_heart") +
      "\n"
  );
}
