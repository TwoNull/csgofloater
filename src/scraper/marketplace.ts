import { randomDesktop } from "./useragents";
import axios from "axios";
import fs from "fs";

async function scrapeMarketItems(
  unhashedName: string,
  minFloat: number,
  maxFloat: number
) {
  let total = [];
  if (minFloat < 0.07) {
    const scrapedItem = await scrapeMarketItem(unhashedName + " (Factory New)");
    total.concat(scrapedItem);
  }
  if (minFloat < 0.15 && maxFloat >= 0.07) {
    const scrapedItem = await scrapeMarketItem(
      unhashedName + " (Minimal Wear)"
    );
    total.concat(scrapedItem);
  }
  if (minFloat < 0.38 && maxFloat >= 0.15) {
    const scrapedItem = await scrapeMarketItem(
      unhashedName + " (Field-Tested)"
    );
    total.concat(scrapedItem);
  }
  if (minFloat < 0.45 && maxFloat >= 0.38) {
    const scrapedItem = await scrapeMarketItem(unhashedName + " (Well-Worn)");
    total.concat(scrapedItem);
  }
  if (maxFloat >= 0.45) {
    const scrapedItem = await scrapeMarketItem(
      unhashedName + " (Battle-Scarred)"
    );
    total.concat(scrapedItem);
  }
  writeJsonFile(`./data/${unhashedName}.json`, total);
}

async function scrapeMarketItem(hashName: string) {
  let firstReq = await scrapeMarketPage(0, hashName);
  if (firstReq[1] <= 100) {
    return firstReq[0];
  }
  let i: number;
  for (i = 100; i <= firstReq[1]; i += 100) {
    firstReq[0].concat((await scrapeMarketPage(i, hashName))[0]);
  }
  firstReq[0].concat((await scrapeMarketPage(i, hashName))[0]);
  return firstReq[0];
}

async function scrapeMarketPage(start: number, hashName: string) {
  const encodedHashName = encodeURI(hashName);
  const url = `https://steamcommunity.com/market/listings/730/${encodedHashName}/render?query=&start=${start}&count=100&currency=${1}&country=US&language=english&filter=`;
  const referer = `https://steamcommunity.com/market/listings/730/${encodedHashName}`;
  const res = await axios.get(url, {
    headers: {
      Host: "steamcommunity.com",
      Origin: "https://steamcommunity.com/",
      Referer: referer,
      "User-Agent": randomDesktop(),
      Accept: "application/json",
    },
  });
  let results: any[] = [];
  let listing: any;
  for (listing in res.data.listinginfo) {
    results.push({
      listingid: listing.listingid,
      subtotal: listing.converted_price,
      fee: listing.converted_fee,
      total: listing.converted_price + listing.converted_fee,
      inspect: listing.asset.market_actions[0].link,
    });
  }
  return [results, res.data.total_count];
}

function writeJsonFile(path: string, data: any) {
  return fs.writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
}
