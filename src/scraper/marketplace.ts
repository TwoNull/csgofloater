import { randomDesktop } from "../useragents";
import axios from "axios";
import { HttpsProxyAgent } from "hpagent";

export async function scrapeMarketItems(
  unhashedName: string,
  minFloat: number,
  maxFloat: number,
  maxPrice: number
) {
  let total: any;
  total = [];
  if (minFloat < 0.07) {
    const scrapedItem = await scrapeMarketItem(unhashedName + " (Factory New)", maxPrice);
    total = total.concat(scrapedItem);
  }
  if (minFloat < 0.15 && maxFloat >= 0.07) {
    const scrapedItem = await scrapeMarketItem(
      unhashedName + " (Minimal Wear)", maxPrice
    );
    total = total.concat(scrapedItem);
  }
  if (minFloat < 0.38 && maxFloat >= 0.15) {
    const scrapedItem = await scrapeMarketItem(
      unhashedName + " (Field-Tested)", maxPrice
    );
    total = total.concat(scrapedItem);
  }
  if (minFloat < 0.45 && maxFloat >= 0.38) {
    const scrapedItem = await scrapeMarketItem(unhashedName + " (Well-Worn)", maxPrice);
    total = total.concat(scrapedItem);
  }
  if (maxFloat >= 0.45) {
    const scrapedItem = await scrapeMarketItem(
      unhashedName + " (Battle-Scarred)", maxPrice
    );
    total = total.concat(scrapedItem);
  }
  return total;
}

async function scrapeMarketItem(hashName: string, maxPrice: number) {
  let firstReq = await scrapeMarketPage(0, hashName, maxPrice);
  if (firstReq[1] <= 100) {
    return firstReq[0];
  }
  let i: number;
  for (i = 100; i <= firstReq[1]; i += 100) {
    firstReq[0] = firstReq[0].concat((await scrapeMarketPage(i, hashName, maxPrice))[0]);
  }
  firstReq[0] = firstReq[0].concat((await scrapeMarketPage(i, hashName, maxPrice))[0]);
  return firstReq[0];
}

export async function scrapeMarketPage(
  start: number,
  hashName: string,
  maxPrice: number
): Promise<any> {
  try {
    const encodedHashName = encodeURI(hashName);
    const url = `https://steamcommunity.com/market/listings/730/${encodedHashName}/render?query=&start=${start}&count=100&currency=${1}&country=US&language=english&filter=`;
    const referer = `https://steamcommunity.com/market/listings/730/${encodedHashName}`;
    const res = await axios.get(url, {
      headers: {
        Host: "steamcommunity.com",
        Origin: "https://steamcommunity.com/",
        Referer: referer,
        "User-Agent": randomDesktop(),
        Accept: "*/*",
        Connection: "keep-alive",
      },
      httpsAgent: new HttpsProxyAgent({
        keepAlive: true,
        proxy: `http://mr10803lbO3:MHcryKGXAR_region-northamerica@ultra.marsproxies.com:44443`,
      }),
    });
    let results: any[] = [];
    let listing: any;
    for (listing in res.data.listinginfo) {
      if(res.data.listinginfo[listing].converted_price +
        res.data.listinginfo[listing].converted_fee <= maxPrice) {
          results.push({
            listingid: res.data.listinginfo[listing].listingid,
            subtotal: res.data.listinginfo[listing].converted_price,
            fee: res.data.listinginfo[listing].converted_fee,
            total:
              res.data.listinginfo[listing].converted_price +
              res.data.listinginfo[listing].converted_fee,
            inspect: `steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20M${
              res.data.listinginfo[listing].listingid
            }A${res.data.listinginfo[listing].asset.id}D${res.data.listinginfo[
              listing
            ].asset.market_actions[0].link.substring(89)}`,
          });
        }
    }
    return [results, res.data.total_count];
  } catch (err: any) {
    await timeout(1000);
    return scrapeMarketPage(start, hashName, maxPrice);
  }
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
