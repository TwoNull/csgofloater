import SteamUser from "steam-user";
import chalk from "chalk";
import emoji from "node-emoji";
import axios from "axios";
import fs from "fs";
import { HttpsProxyAgent } from "hpagent";
import { randomDesktop } from "../useragents";
import {
  LoginSession,
  EAuthTokenPlatformType,
  EAuthSessionGuardType,
} from "steam-session";
import {
  guardCodePrompt,
  buyPrompt,
  logo,
  colorize,
} from "../interface/interface";
const CONFIG = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

export async function automate(results: any, data: any) {
  const cookies: any = await getCookies();
  const sessionid = cookies[0];
  const steamloginsecure = cookies[1][cookies[1].length - 1];
  const payload = `sessionid=${sessionid}&currency=1&subtotal=1&fee=1&total=1&quantity=1&first_name=${
    CONFIG.billing.first_name
  }&last_name=${CONFIG.billing.last_name}&billing_address=${steamifyString(
    CONFIG.billing.billing_address_1
  )}&billing_address_two=${steamifyString(
    CONFIG.billing.billing_address_1
  )}&billing_country=${
    CONFIG.billing.billing_country
  }&billing_city=${steamifyString(CONFIG.billing.billing_city)}&billing_state=${
    CONFIG.billing.billing_state
  }&billing_postal_code=${
    CONFIG.billing.billing_postal_code
  }&save_my_address=1`;
  let totalCost = 0;
  let itemsToBuy: any;
  itemsToBuy = [];
  console.log();
  for (let i = 0; i < results.length; i++) {
    const instock = await checkStock(
      sessionid,
      steamloginsecure,
      data[parseInt(results[i])].listingid,
      payload
    );
    if (!instock) {
      console.log(
        chalk.red("✖ ") +
          colorize(
            data[parseInt(results[i])].name,
            data[parseInt(results[i])].quality
          ) +
          ` | float: ${data[parseInt(results[i])].float.toFixed(
            18
          )} | price: $${(data[parseInt(results[i])].total / 100).toFixed(2)}`
      );
    } else {
      console.log(
        chalk.green("✓ ") +
          colorize(
            data[parseInt(results[i])].name,
            data[parseInt(results[i])].quality
          ) +
          ` | float: ${data[parseInt(results[i])].float.toFixed(
            18
          )} | price: $${(data[parseInt(results[i])].total / 100).toFixed(2)}`
      );
      itemsToBuy.push(data[parseInt(results[i])]);
      totalCost += data[parseInt(results[i])].total;
    }
    await timeout(200);
  }
  console.log();
  if (itemsToBuy.length != results.length) {
    console.log(
      chalk.red("Warning! ") +
        emoji.get("construction") +
        chalk.bold(results.length - itemsToBuy.length) +
        " Items Have Sold Since Calculating the Output!"
    );
  }
  const dollars = totalCost / 100;
  const proceed = await buyPrompt(dollars, itemsToBuy.length);
  if (proceed == "yes") {
    logo();
    console.log();
    console.log(chalk.yellow("Proceeding with Caution!"));
    for (let i = 0; i < results.length; i++) {
      const purchasePayload = `sessionid=${sessionid}&currency=1&subtotal=${
        data[parseInt(results[i])].subtotal
      }&fee=${data[parseInt(results[i])].fee}&total=${
        data[parseInt(results[i])].total
      }&quantity=1&first_name=${CONFIG.billing.first_name}&last_name=${
        CONFIG.billing.last_name
      }&billing_address=${steamifyString(
        CONFIG.billing.billing_address_1
      )}&billing_address_two=${steamifyString(
        CONFIG.billing.billing_address_1
      )}&billing_country=${
        CONFIG.billing.billing_country
      }&billing_city=${steamifyString(
        CONFIG.billing.billing_city
      )}&billing_state=${CONFIG.billing.billing_state}&billing_postal_code=${
        CONFIG.billing.billing_postal_code
      }&save_my_address=1`;
      const success = await checkout(
        sessionid,
        steamloginsecure,
        data[parseInt(results[i])].listingid,
        purchasePayload
      );
      if (!success) {
        console.log(
          chalk.red("✖ ") +
            colorize(
              data[parseInt(results[i])].name,
              data[parseInt(results[i])].quality
            ) +
            ` | float: ${data[parseInt(results[i])].float.toFixed(
              18
            )} | price: $${(data[parseInt(results[i])].total / 100).toFixed(2)}`
        );
      } else {
        console.log(
          chalk.green("✓ ") +
            colorize(
              data[parseInt(results[i])].name,
              data[parseInt(results[i])].quality
            ) +
            ` | float: ${data[parseInt(results[i])].float.toFixed(
              18
            )} | price: $${(data[parseInt(results[i])].total / 100).toFixed(2)}`
        );
        itemsToBuy.push(data[parseInt(results[i])]);
        totalCost += data[parseInt(results[i])].total;
      }
      await timeout(200);
    }
  } else {
    return;
  }
}

async function checkout(
  sessionid: string,
  steamloginsecure: string,
  listingid: string,
  data: string
) {
  try {
    const url = `https://steamcommunity.com/market/buylisting/${listingid}`;
    const res = await axios.post(url, data, {
      headers: {
        Host: "steamcommunity.com",
        Origin: "https://steamcommunity.com/",
        Referer: `https://steamcommunity.com/market/listings/730/`,
        "User-Agent": randomDesktop(),
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: `sessionid=${sessionid}; ${steamloginsecure}`,
      },
    });
    if (res.data.wallet_info.success == 1) {
      return true;
    }
    return false;
  } catch (err: any) {
    if (err.response && err.response.data) {
      return false;
    }
    await timeout(1000);
    return checkStock(sessionid, steamloginsecure, listingid, data);
  }
}

async function checkStock(
  sessionid: string,
  steamloginsecure: string,
  listingid: string,
  data: string
): Promise<any> {
  try {
    const url = `https://steamcommunity.com/market/buylisting/${listingid}`;
    const res = await axios.post(url, data, {
      headers: {
        Host: "steamcommunity.com",
        Origin: "https://steamcommunity.com/",
        Referer: `https://steamcommunity.com/market/listings/730/`,
        "User-Agent": randomDesktop(),
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: `sessionid=${sessionid}; ${steamloginsecure}`,
      },
    });
  } catch (err: any) {
    if (err.response && err.response.data) {
      return (
        err.response.data.message ==
        "There was a problem purchasing your item. The listing may have been removed. Refresh the page and try again."
      );
    }
    await timeout(1000);
    return checkStock(sessionid, steamloginsecure, listingid, data);
  }
}

async function getCookies() {
  logo();
  if (!CONFIG.user_login.refresh) {
    await getRefresh();
  }
  return await new Promise(async (resolve, reject) => {
    let user = new SteamUser();
    //@ts-ignore
    user.logOn({ refreshToken: CONFIG.user_login.refresh });
    user.on("webSession", (sessionID, cookies) => {
      logo();
      console.log(
        chalk.green("Got Web Session for " + chalk.bold(user.accountInfo!.name))
      );
      resolve([sessionID, cookies]);
    });
  });
}

async function getRefresh() {
  return await new Promise(async (resolve, reject) => {
    let session = new LoginSession(EAuthTokenPlatformType.SteamClient);
    const res = await session.startWithCredentials({
      accountName: CONFIG.user_login.user,
      password: CONFIG.user_login.pass,
    });
    if (res.actionRequired) {
      if (
        res.validActions![res.validActions!.length - 1].type ==
        EAuthSessionGuardType.DeviceCode
      ) {
        let code = await guardCodePrompt("Mobile Device");
        while (true) {
          try {
            await session.submitSteamGuardCode(code);
          } catch {
            logo();
            console.log(chalk.red("Invalid Steam Guard Code!"));
            code = await guardCodePrompt("Mobile Device");
          }
        }
      }
      if (
        res.validActions![res.validActions!.length - 1].type ==
        EAuthSessionGuardType.EmailCode
      ) {
        let code = await guardCodePrompt("Email");
        while (true) {
          try {
            await session.submitSteamGuardCode(code);
          } catch {
            logo();
            console.log(chalk.red("Invalid Steam Guard Code!"));
            code = await guardCodePrompt("Email");
          }
        }
      }
      if (
        res.validActions![res.validActions!.length - 1].type ==
        EAuthSessionGuardType.DeviceConfirmation
      ) {
        console.log(
          chalk.yellow("Confirm your Login in the Steam Guard App! ") +
            emoji.get("construction")
        );
      }
      if (
        res.validActions![res.validActions!.length - 1].type ==
        EAuthSessionGuardType.EmailConfirmation
      ) {
        console.log(
          chalk.yellow("Check Your Email for a Confirmation Link! ") +
            emoji.get("construction")
        );
      }
    }
    session.on("authenticated", async () => {
      logo();
      console.log(
        chalk.green(chalk.bold(session.accountName) + " " + "Authenticated! ✓")
      );
      CONFIG.user_login.refresh = session.refreshToken;
      fs.writeFileSync(
        "./config.json",
        JSON.stringify(CONFIG, null, 4),
        "utf-8"
      );
      resolve(true);
    });
  });
}

function steamifyString(s: string) {
  const arr = s.split(" ");
  let temp = "";
  for (let i = 0; i < arr.length - 1; i++) {
    temp += arr[i] + "+";
  }
  temp += arr[arr.length - 1];
  return temp;
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
