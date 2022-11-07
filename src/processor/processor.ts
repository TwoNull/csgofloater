import botcontroller from './lib/bot_controller'
import InspectURL from './lib/inspect_url'
import CONFIG from '../../config'
import Job from './lib/job'
import Queue from './lib/queue'
const botController = new botcontroller();
const queue = new Queue();

export function loginBots() {
    for (let loginData of CONFIG.logins) {
        botController.addBot(loginData, CONFIG.bot_settings);
    }
}

export function addJob(urls: any, response: any) {
    let price: any
    const job = new Job({ip: '1'}, response, /* bulk */ true);
    for(const url in urls) {
        const link = new InspectURL(url);
        job.add(link, price);
    }
    queue.addJob(job, CONFIG.bot_settings.max_attempts);
}