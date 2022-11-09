import InspectURL from "./lib/inspect_url";
import Bot from "./lib/bot";
import { colorize } from "../interface/interface";
import fs from "fs";
const CONFIG = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

export async function processFloats(data: any) {
  let bots: any;
  bots = [];
  for (let i = 0; i < CONFIG.bot_logins.length; i++) {
    const loginData = CONFIG.bot_logins[i];
    if (!loginData) {
      throw "You Must Configure Bot Logins in 'config.ts'";
    }
    bots[i] = new Bot(CONFIG.bot_settings);
    bots[i].logIn(loginData.user, loginData.pass, loginData.auth);
  }
  let answer: any;
  answer = [];
  for (let i = 0; i < data.length; i++) {
    let arrayOfItems: any;
    arrayOfItems = [];
    for (let j = 0; j < data[i][1].length; j++) {
      arrayOfItems.push(
        inspectItem(bots, data[i][1][j], data[i][0], data[i][2])
      );
      await timeout(5)
    }
    const completed = await Promise.all(arrayOfItems);
    answer = answer.concat(completed);
    console.log(
      `completed parsing ${data[i][1].length} floats for ${colorize(
        data[i][0],
        data[i][2]
      )}`
    );
  }
  return answer;
}

async function inspectItem(
  bots: any,
  item: any,
  itemName: any,
  quality: any
): Promise<any> {
  try {
    let bot = await getBot(bots);
    const link = new InspectURL(item.inspect);
    const res = await bot.sendFloatRequest(link);
    const newItem = { ...item };
    newItem.float = res.iteminfo.floatvalue;
    newItem.name = itemName;
    newItem.quality = quality;
    return newItem;
  } catch {
    return inspectItem(bots, item, itemName, quality);
  }
}

async function getBot(bots: any): Promise<any> {
  let bot: any;
  for (let k = 0; k < bots.length; k++) {
    if (!bots[k].busy) {
      bot = bots[k];
      break;
    }
  }
  if (!bot) {
    await timeout(500);
    return getBot(bots);
  }
  return bot;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
