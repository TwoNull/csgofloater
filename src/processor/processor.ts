import CONFIG from '../../config'
import InspectURL from './lib/inspect_url'
import Bot from './lib/bot'
import fs from "fs";

export async function processFloats(data: any) {
    let bots: any
    bots = []
    for (let i = 0; i < CONFIG.logins.length; i++) {
        const loginData = CONFIG.logins[i]
        if(!loginData) {
            throw 'You Must Configure Bot Logins in \'config.ts\''
        }
        bots[i] = new Bot(CONFIG.bot_settings);
        bots[i].logIn(loginData.user, loginData.pass, loginData.auth);
        
    }
    for(let i = 0; i < data.length; i++) {
        let arrayOfItems: any
        arrayOfItems = []
        for(let j = 0; j < data[i][1].length; j++) {
            arrayOfItems.push(inspectItem(bots, data[i][1][j]))
        }
        await Promise.all(arrayOfItems)
        writeJsonFile(`../../data/${data[i][0]}.json`, arrayOfItems)
        console.log(`completed parsing floats for ${data[i][0]}`)
    }
}

async function inspectItem(bots: any, item: any): Promise<any> {
    try {
        let bot = await getBot(bots)
        const link = new InspectURL(item.inspect)
        return (await bot.sendFloatRequest(link)).iteminfo.floatvalue
    }
    catch {
        return inspectItem(bots, item)
    }
}

async function getBot(bots: any): Promise<any> {
    let bot: any
    for(let k = 0; k < bots.length; k++) {
        if (!bots[k].busy) {
            bot = bots[k]
            break
        }
    }
    if(!bot) {
        await timeout(500)
        return getBot(bots)
    }
    return bot
}

function writeJsonFile(path: string, data: any) {
    return fs.writeFileSync(path, JSON.stringify(data, null, 4), 'utf-8');
}

  function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
