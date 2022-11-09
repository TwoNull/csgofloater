import {
  collectionPrompt,
  continuePrompt,
  qualityPrompt,
  skinPrompt,
  colorize,
  logo,
  floatPrompt
} from "./src/interface/interface";
import { scrapeMarketItems } from "./src/scraper/marketplace";
import { processFloats } from "./src/processor/processor";
import fs from "fs";
import chalk from "chalk";
import cliProgress from "cli-progress";
import { runModeler } from "./src/modeler/run";
import { automate } from "./src/automator/automate";

async function main() {
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }
  const itemsJson = readJsonFile("./src/items/items.json");
  const answer = await collectionSelection(itemsJson);
  const desiredFloat = getIEEE754(await floatPrompt(answer[0]));
  logo();
  console.log(`Closest Target Float for your ${colorize(answer[0].name, answer[0].quality)}: ${chalk.bold(desiredFloat)}`)
  const afv =
    (desiredFloat - answer[0].minwear) /
    (answer[0].maxwear - answer[0].minwear);
  console.log();
  console.log("Average Float of Inputs: " + chalk.bold(afv));
  console.log("\n");
  const scrape = await beginScrape(answer[0], answer[1]);
  const data = await beginProcessing(scrape);
  const results = await beginModeling(data, afv)
  console.log()
  console.log('Input Skins:')
  let total = 0;
  for(let i = 0; i < results.length; i++) {
    console.log(colorize(data[parseInt(results[i])].name, data[parseInt(results[i])].quality) + ` | float: ${data[parseInt(results[i])].float.toFixed(18)} | price: $${(data[parseInt(results[i])].total / 100).toFixed(2)}`)
    total += data[parseInt(results[i])].float
  }
  const average = total / 10
  console.log('Outcome Float: ' + chalk.bold(((answer[0].maxwear - answer[0].minwear)*average) + answer[0].minwear))
  if(await continuePrompt() == 'yes') {
    await automate(results, data)
  }
  else {
    return
  }
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
  let data: any;
  data = [];
  const progressBar = new cliProgress.SingleBar({
    format:
      "{filename} | " +
      colorize("{bar}", tradeQuality) +
      "| {percentage}% || {value}/{total} Skins Scraped",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });
  for (const item in collection.skins[tradeQuality]) {
    progressBar.start(1, 0, {
      speed: "N/A",
    });
    progressBar.update({ filename: colorize(collection.skins[tradeQuality][item].name, tradeQuality) });
    data.push([
      collection.skins[tradeQuality][item].name,
      await scrapeMarketItems(
        collection.skins[tradeQuality][item].name,
        collection.skins[tradeQuality][item].minwear,
        collection.skins[tradeQuality][item].maxwear,
      ),
      tradeQuality,
    ]);
    progressBar.increment(1);
    progressBar.stop();
  }
  console.log("\nAll skins scraped! Now gathering float values...");
  return data;
}

async function beginProcessing(data: any) {
  return await processFloats(data);
}

async function beginModeling(data: any, avg: number) {
  let s = ''
  for(let i = 0; i < data.length; i++) {
    s += `${data[i].float} `
  }
  fs.writeFileSync('./data/floats.txt', s, "utf-8")
  const res = await runModeler(avg)
  return res
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
