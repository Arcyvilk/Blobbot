const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var CMD = require('./cmd.js');
var cmd;

var emojis = {};

const token = process.env.DISCORD_API_TOKEN;
bot.login(token);

bot.on('ready', () => {
    var data = Date.now();
    bot.user.setPresence({ game: { name: "blob!info -> DM", type: 0 } });
    console.log(`${data} - Blobbot reports for duty!`);
    
    cmd = new CMD.CMD();
    fetchCommands(cmds => {
        cmd.getCommands(cmds);
    });
    cmd.getBot(bot);
    fetchEmojis();

    setInterval(() => {
        fetchEmojis();            
    }, 60000);
});

bot.on('message', message => {
    var m = message.content;

    if (!message.author.bot) {
        if (keywordDetected(message.content)) { //this function handless all non-emoji commands
            cmd.getMessage(message);
            cmd.getEmojis(emojis);
            cmd.checkForCommands();
            deleteMessageIfCan(message);
            return;
        }

        for (name in emojis) { //this function handles just emojis
            if (message.content.indexOf(`:${name}:`) != -1 && message.content.indexOf(`<:${name}:`) == -1) {
                replaceEmote = (function () {
                    var findThis = `:${name}:`;
                    var regex = new RegExp(findThis, 'g')
                    m = m.replace(regex, `<:${name}:${emojis[name]}>`);
                })();
            }                    
        }
        if (message.content !== m) {
            sendNewMessage = (function () {
                if (message.guild) {
                    message.channel.send(`**${message.author.username}:** ${m}`);
                    deleteMessageIfCan(message);
                }
                else
                    message.channel.send(`${m}`);
            })();
        }
    }
});

function keywordDetected(msg) {
    if (msg.startsWith("blob!"))
        return true;
    return false;
}

//--------------------------------------------------------------
//------------------------CUSTOM FUNCTIONS----------------------
//--------------------------------------------------------------

function fetchEmojis() {
    var g = bot.guilds.array();
    var d = Date.now();
    emojis = {};

    for (i in g) {
        var e = g[i].emojis.array();
        for (j in e)
            emojis[e[j].name] = e[j].id;
    }
};
function fetchCommands(callback) {
    fs.readFile('commandList.json', 'utf8', (err, list) => {
        if (err) {
            var d = Date.now();
            console.log(`${d} - error while fetching command list!`);
            return;
        }
        callback(JSON.parse(list));
        return;
    });
}

function deleteMessageIfCan(message) {
    if (message.guild) {
        if (message.guild.me.hasPermission('MANAGE_MESSAGES'))
            message.delete(3000);
    }
};