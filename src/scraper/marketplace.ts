import axios from "axios";
import fs from "fs";

async function scrapeMarket() {}

async function scrapeMarketPage(start: number, hashName: string) {
  const url = `https://steamcommunity.com/market/listings/730/${encodeURI(
    hashName
  )}/render?query=&start=${start}&count=100&currency=${1}&country=US&language=english&filter=`;
  const res = axios.get(url, {});
}

function readJsonFile(path: string) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function writeJsonFile(path: string, data: any) {
  return fs.writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
}
