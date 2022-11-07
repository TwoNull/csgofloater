import {
  collectionPrompt,
  floatPrompt,
  logo,
  qualityPrompt,
  skinPrompt,
} from "./src/interface/interface";
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
