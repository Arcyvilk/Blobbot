const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var emojis = {};

const token = process.env.DISCORD_API_TOKEN;
bot.login(token);

bot.on('ready', () => {
    var data = Date.now();
    bot.user.setPresence({ game: { name: "GIBE EMOTES", type: 0 } });
    console.log(`${data} - Blobbot reports for duty!`);

    if (fetchEmojis())
        console.log(`${data} - emoji fetching succesful!`);
});

bot.on('message', message => {
    var m = message.content;

    if (!message.author.bot) {
        if (message.content.startsWith(':') && message.content.endsWith(':')) {
            var m = message.content.substring(1, message.content.length - 1);
            if (emojis.hasOwnProperty(m)) {
                message.channel.send(`**${message.author.username}**: <:${m}:${emojis[m]}>`);
                message.delete(3000);
            }
        }
    }
});

function fetchEmojis() {
    var g = bot.guilds.array();

    for (i in g) {
        var e = g[i].emojis.array();
        for (j in e)
            emojis[e[j].name] = e[j].id;
    }
    return true;
};