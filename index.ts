import {
  collectionPrompt,
  floatPrompt,
  logo,
  qualityPrompt,
  skinPrompt,
} from "./src/interface/interface";
import {
    scrapeMarketItems
} from "./src/scraper/marketplace"
import fs from "fs";
import { processFloats } from "./src/processor/processor";

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
  console.log('Input Average:' + afv)
  const data = await beginScrape(answer[0], answer[1])
  await beginProcessing(data)
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

async function beginScrape(skin: any, collection: any) {
  let tradeQuality: number;
  if (skin.quality == 2) {
    tradeQuality = 1;
  } else {
    tradeQuality = skin.quality - 2;
  }
  let data: any
  data = []
  for(const item in collection.skins[tradeQuality]) {
    data.push([collection.skins[tradeQuality][item].name, await scrapeMarketItems(collection.skins[tradeQuality][item].name, collection.skins[tradeQuality][item].minwear, collection.skins[tradeQuality][item].maxwear)])
  }
  console.log('\nAll skins scraped! Now gathering float values...')
  return data
}

async function beginProcessing(filenames: any) {
    return await processFloats(filenames)
}

function readJsonFile(path: string) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function getIEEE754(x: number) {
  x = Number(x);
  var float = new Float32Array(1);
  float[0] = x;
  return float[0];
}
main();
