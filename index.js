const { MongoClient } = require("mongodb");
const TelegramBot = require('node-telegram-bot-api');
const express = require("express");
const app = express();


const uri = "mongodb+srv://dmytrosablin:dmytro2006@liltendo.rtlj85v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('test');
const users = database.collection('users');


async function record(id) {
    try {
        const query = { id: id };
        const user = await users.findOne(query);
        if (user == null) {
            await bot.sendMessage(id, 'You are not in game!', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Play a game", web_app: {url}}]
                    ]
                }
            })
        } else {
            await bot.sendMessage(id, `Your record is ${user.record.toString()}`)

        }

    } finally  {
        // await client.close();
    }
}

async function leader(id) {
    try {
        let leaders = await users.find({}).sort([['record', -1]]).toArray()
        let text = "";
        // await bot.sendMessage(chatId, 'There is our leaders: ')
        for (let i = 0; i < leaders.length; i++) {
            // bot.sendMessage(chatId, leaders[i].record.toString())
            text += `${leaders[i].name} - ${leaders[i].record.toString()}\n`
        }
        await bot.sendMessage(id, "There is our leaders: \n"+ text)

    } finally {

    }
}
app.get("/", (req, res) => {
    res.send("TEST").status(200);
});


const token = '6602794619:AAEspg2Ru9CL3XvUInibD_uVBrTLVepmpZc';
const url = 'https://liltendo.onrender.com/'

const bot = new TelegramBot(token, {polling: true});


app.listen("3000", () => {
    bot.setMyCommands([
        {
            command: "play",
            description: "Play a game"
        },
        {
            command: "record",
            description: "My record"
        },
        {
            command: "leaders",
            description: "Game leaders"
        }
    ]);

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

            await record(chatId)

        } else if (text == '/leaders') {

            await leader(chatId)

        }
    });
})