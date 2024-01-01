const TelegramBot = require('node-telegram-bot-api');
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json("hdsakjfh")
})
app.listen(3000, () => {

})

const token = '6547440836:AAGwyxMMR-v_c7NmDYFy53t4-icWd-bAG0E';
const url = 'https://liltendo.onrender.com/'

const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text == '/start' || text == '/play') {
        await bot.sendMessage(chatId, 'Hello, my friend!', {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Open game", web_app: {url}}]
                ]
            }
        })
    } else if (text == '/record') {
        const data = await fetch(`https://liltendo.onrender.com/api/${chatId.toString()}`);
        const record = await data.json()
        await bot.sendMessage(chatId, `Your record is ${record}`)
    } else if (text == '/leaders') {
        const data = await fetch('https://liltendo.onrender.com/api/get_liders')
        const leaders = await data.json();
        let text = "";
        // await bot.sendMessage(chatId, 'There is our leaders: ')
        for (let i = 0; i < leaders.length; i++) {
            // bot.sendMessage(chatId, leaders[i].record.toString())
            text += `${leaders[i].name} - ${leaders[i].record.toString()}\n`
        }
        await bot.sendMessage(chatId, "There is our leaders: \n"+ text)
    }
});
