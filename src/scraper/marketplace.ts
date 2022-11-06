import {randomDesktop} from "./useragents"
import axios from "axios";
import fs from "fs";

async function scrapeMarket(hashName: string) {

}

async function scrapeMarketPage(start: number, hashName: string) {
  const encodedHashName = encodeURI(hashName)
  const url = `https://steamcommunity.com/market/listings/730/${encodedHashName}/render?query=&start=${start}&count=100&currency=${1}&country=US&language=english&filter=`;
  const referer = `https://steamcommunity.com/market/listings/730/${encodedHashName}`
  const res = await axios.get(url, {
    headers: {
        'Host': 'steamcommunity.com',
        'Origin': 'https://steamcommunity.com/',
        'Referer': referer,
        'User-Agent': randomDesktop(),
        'Accept': 'application/json'
    }
  });
  let results: any[] = []
  let listing: any;
  for(listing in res.data.listinginfo) {
    results.push({'listingid': listing.listingid, 'subtotal': listing.converted_price, 'fee': listing.converted_fee, 'total': listing.converted_price + listing.converted_fee, 'inspect': listing.asset.market_actions[0].link})
  }
}

function readJsonFile(path: string) {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}

function writeJsonFile(path: string, data: any) {
  return fs.writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
}