const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
var commands = {};

const token = process.env.DISCORD_API_TOKEN;
bot.login(token);

bot.on('ready', () => {
    var data = Date.now();

    fs.readFile('commands.json', 'utf8', (err, jsonContents) => {
        if (err)
            console.log(err);
        commands = JSON.parse(jsonContents);
    });
    bot.user.setPresence({ game: { name: "e!help for help", type: 0 } });
    console.log(`${data} - Blobbot reports for duty!`);
});

bot.on('message', message => {
    var m = message.content;

    if (!message.author.bot) {
        if (m.startsWith('e!')) {
            if (m.startsWith('e!add')) {
                if (m.indexOf('|') == -1) {
                    message.channel.send(':no_entry_sign: The syntax for this command is ``e!add <command_name> | <emote>``\n' +
                        'Example: ``e!add viktor| :viktor:``');
                    return;
                }
                var emote = m.substring(5).trim().split('|');
                if (commands.hasOwnProperty(emote[0])) {
                    message.channel.send(`:no_entry_sign: Emote named ${emote[0]} already exists in the database.`)
                    return;
                }
                commands[emote[0].trim()] = emote[1].trim();
                fs.writeFile('commands.json', JSON.stringify(commands), err => {
                    if (err)
                        console.log(err);
                    message.channel.send(`:white_check_mark: Emote ${emote[0]} added!`)
                });
            }
            if (m.startsWith('e!list')) {
                var list = '**List of emotes:** ';
                for (i in commands)
                    list += `| ${i} `;
                message.channel.send(list);
                return;
            }
            if (m.startsWith('e!help')) {
                var list = '**Commands:** e!list | e!<emote_name> | e!add <emote_name>|<emote>';
                message.channel.send(list);
                return;
            }
            if (!m.startsWith('e!list') && !m.startsWith('e!add')) {
                var cmd = m.substring(2).trim();
                if (!commands.hasOwnProperty(cmd)) {
                    message.channel.send(':no_entry_sign: Such emote doesn\'t exist.');
                    return;
                }
                message.channel.send(`${message.author.username}: ${commands[cmd]}`);
            }
            message.delete(3000);
        }
    }
});