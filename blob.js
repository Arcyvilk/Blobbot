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

    fetchEmojis();
    setInterval(() => {
        fetchEmojis();            
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
                'Whenever you use :emote: in a message I will fix that for you.\n' +
                'I update my emotes every 60 seconds.\n\n' +
                '**Commands:** ``blob!info`` | ``blob!list``\n' +
                `**Number of emotes:** ${Object.keys(emojis).length}\n` +
                '**Invite link:** https://discordapp.com/oauth2/authorize?client_id=356890709799862273&scope=bot&permissions=0x00042000');
            message.delete(3000);
        }
        if (message.content == 'blob!list') {
            var list = [];
            var m = `**List of emotes:**`;

            for (name in emojis)
                list.push(name);
            list.sort();
            for (i in list) {
                if (`${m} | \`\`${list[i]}\`\``.length >= 1900) {
                    message.author.send(m);
                    m = '';
                }
                m += ` | \`\`${list[i]}\`\``;
            }
            message.author.send(m);
            message.delete(3000);
        }
    }
});

function fetchEmojis() {
    var g = bot.guilds.array();
    var d = Date.now();

    for (i in g) {
        var e = g[i].emojis.array();
        for (j in e)
            emojis[e[j].name] = e[j].id;
    }
    console.log(`${d} - emoji fetching succesful!`);
};