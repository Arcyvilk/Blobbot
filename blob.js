const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var emojis = {};

const token = process.env.DISCORD_API_TOKEN;
bot.login(token);

bot.on('ready', () => {
    var data = Date.now();
    bot.user.setPresence({ game: { name: "blob!info -> DM", type: 0 } });
    console.log(`${data} - Blobbot reports for duty!`);

    setInterval(() => {
        if (fetchEmojis())
            console.log(`${data} - emoji fetching succesful!`);
    }, 60000);
});

bot.on('message', message => {
    var m = message.content;

    if (!message.author.bot) {
        for (name in emojis) {
            if (message.content.indexOf(`:${name}:`) != -1) {
                m = m.replace(`:${name}:`, `<:${name}:${emojis[name]}>`);
            }
        }
        if (message.content !== m) {
            message.channel.send(`**${message.author.username}**: ${m}`);
            message.delete(3000);
        }

        if (message.content == 'blob!info') {
            message.author.send('I am an emote bot. Add me to any server and I\'ll be able to use this server\s emotes globally.\n' +
                'Whenever you use :emote: in a message I will fix that for you.\n\n' +
                '**Commands:** ``blob!info`` | ``blob!list``\n' +
                '**Invite link:** https://discordapp.com/oauth2/authorize?client_id=356890709799862273&scope=bot&permissions=0x00042000');
            message.delete(3000);
        }
        if (message.content == 'blob!list') {
            var list = '';
            for (name in emojis)
                list += ` | ${name}`;
            message.author.send(`**List of emotes:**${list}`);
            message.delete(3000);
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