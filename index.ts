import {
  collectionPrompt,
  floatPrompt,
  logo,
  qualityPrompt,
  skinPrompt,
} from "./src/interface/interface";
/*import {
    scrapeMarketItems
} from "./src/scraper/marketplace"*/
import {
    addJob,
    loginBots
} from "./src/processor/processor"
import fs from "fs";

async function main() {
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }
  const itemsJson = readJsonFile("./src/items/items.json");
  logo();
  const answer = await collectionSelection(itemsJson);
  const desiredFloat = getIEEE754(await floatPrompt(answer[0]));
  const afv =
    (desiredFloat - answer[0].minwear) /
    (answer[0].maxwear - answer[0].minwear);
afv
  //const filenames = await beginScrape(answer[0], answer[1])
  //await beginProcessing(filenames)
  const res = {}
  loginBots()
  addJob(['steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198084749846A698323590D7935523998312483177', 'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M625254122282020305A6760346663D30614827701953021'], res)
  await timeout(20000)
  console.log(res)
}

async function collectionSelection(itemsJson: any): Promise<any> {
  const collection = await collectionPrompt(itemsJson);
  return await qualitySelection(collection, itemsJson);
}

async function qualitySelection(collection: any, itemsJson: any): Promise<any> {
  const quality = await qualityPrompt(collection);
  if (quality == 11) {
    return await collectionSelection(itemsJson);
  }
  return await skinSelection(collection, itemsJson, quality);
}

async function skinSelection(
  collection: any,
  itemsJson: any,
  quality: any
): Promise<any> {
  const skin = await skinPrompt(quality);
  if (skin == 11) {
    return await qualitySelection(collection, itemsJson);
  }
  return [skin, collection];
}

/*async function beginScrape(skin: any, collection: any) {
  let tradeQuality: number;
  if (skin.quality == 2) {
    tradeQuality = 1;
  } else {
    tradeQuality = skin.quality - 2;
  }
  let filenames: any
  filenames = []
  for(const item in collection.skins[tradeQuality]) {
    filenames.push(await scrapeMarketItems(collection.skins[tradeQuality][item].name, collection.skins[tradeQuality][item].minwear, collection.skins[tradeQuality][item].maxwear))
  }
  console.log('\nAll skins scraped! Now gathering float values...')
  return filenames
}*/

/*async function beginProcessing(filenames: any) {
    return null
}*/

function readJsonFile(path: string) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function getIEEE754(x: number) {
  x = Number(x);
  var float = new Float32Array(1);
  float[0] = x;
  return float[0];
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();
