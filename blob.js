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

        if (m.startsWith("blob!")) {
            checkForCommands(message);
        };
    }
});

//--------------------------------------------------------------
//------------------------CUSTOM FUNCTIONS----------------------
//--------------------------------------------------------------

function keywordDetected(msg) {
    if (msg.startsWith("blob!"))
        return true;
    return false;
}
function removeKeyword(msg) {
    return msg.substring(5).trim();
}

function checkForCommands(msg) {
    if (!keywordDetected(msg.content))
        return;
    var command = removeKeyword(msg.content);

    if (command.startsWith('info')) {
        var toSend = 'I am an emote bot. After adding me to any server I gain access to this server\'s emotes globally. ' +
            'If you try to use those emotes in any other server, I will resend your message with the original emotes attached.\n\n' +
            'If I have necesary permissions,  I will also change my nickname to one similar to yours and remove your original message to not break the flow of conversation.\n\n' +
            'I update my list emotes every 60 seconds.\n\n' +
            '**Commands:** ``blob!info`` | ``blob!list`` | ``blob!servers``\n' +
            `**Number of emotes:** ${Object.keys(emojis).length}\n` +
            '**Webpage:** http://arcyvilk.com/blobbot/ \n' +
            '**Author:** <:arcyvilk:357190068797964298> \`\`Arcyvilk#5460\`\`';
        sendEmbed('Info about Blobbot', toSend, msg.author);
        deleteMessageIfCan(msg);
    }
    if (command.startsWith('list')) {
        var list = [];
        var m = '';

        fetchEmojis();
        for (name in emojis)
            list.push(name);
        list.sort();

        for (i in list) {
            if (`${m}<:${list[i]}:${emojis[list[i]]}> `.length >= 2000) {
                sendEmbed(`List of emotes`, m, msg.author);
                m = '';
            }
            if (!list[i - 1] || list[i].substring(0, 1) != list[i - 1].substring(0, 1))
                m += `\n\`\`${list[i].substring(0, 1)}:\`\``;
            m += `<:${list[i]}:${emojis[list[i]]}>`;
        }
        sendEmbed(`List of emotes`, m, msg.author);
        deleteMessageIfCan(msg);
    }
    if (command.startsWith('servers')) {
        var g = bot.guilds.array();
        var m = '';
        for (i in g)
            m += `\n__${g[i].name}__\n` +
                `\`\`- Owner:\`\` ${g[i].owner.user.username}\n` +
                `\`\`- ID:\`\` ${g[i].id}\n`;
        sendEmbed(`List of servers I'm in`, m, msg.author);
        deleteMessageIfCan(msg);
    }
}

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

function deleteMessageIfCan(message) {
    if (message.guild) {
        if (message.guild.me.hasPermission('MANAGE_MESSAGES'))
            message.delete(3000);
    }
};
function sendEmbed(title, content, channel) {
    var embed = new Discord.RichEmbed()
        .setTitle(title)
        .setColor(`0xFDC000`)
        .setDescription(content);
    channel.send({embed});
};