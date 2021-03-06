﻿exports.CMD = function () {
    var cmd = this;

    //variables
    cmd.msg = '';
    cmd.commands = {};
    cmd.emojis = {};
    cmd.bot = '';

    //getters
    cmd.getMessage = function (msg) { cmd.msg = msg; }
    cmd.getCommands = function (commands) { cmd.commands = commands; }
    cmd.getEmojis = function (emojis) { cmd.emojis = emojis; }
    cmd.getBot = function (bot) { cmd.bot = bot; }

    //technical stuffs
    cmd.checkForCommands = function () {
        var keyword = cmd.removeTriggerword(cmd.msg.content);
        if (keyword.indexOf(' ') != -1)
            keyword = cmd.removeParameters(keyword);
        if (cmd.commands.hasOwnProperty(keyword))
            cmd[cmd.commands[keyword].response]();
    }
    cmd.removeTriggerword = function (input) {
        return input.substring(5).trim();
    }
    cmd.removeParameters = function (input) {
        var output = input.split(' ');
        return output[0];
    }

    //commands themselves
    cmd.toInfo = function () {
        var commandList = '';
        var toSend = '';

        for (let i in cmd.commands) {
            commandList += `\`\`blob!${i}\`\` | `;
        }

        toSend = 'I am an emote bot. After adding me to any server I gain access to this server\'s emotes globally. ' +
            'If you try to use those emotes in any other server, I will resend your message with the original emotes attached.\n\n' +
            'If I have necesary permissions,  I will also remove your original message to not break the flow of conversation.\n\n' +
            'I update my emote list every 60 seconds.\n\n' +
            `**Commands:** ${commandList}\n` +
            `**Number of emotes:** ${Object.keys(cmd.emojis).length}\n` +
            '**Webpage:** http://arcyvilk.com/blobbot/ \n' +
            '**Author:** <:arcyvilk:357190068797964298> \`\`Arcyvilk#5460\`\`';
        cmd.sendEmbed('Info about Blobbot', toSend, cmd.msg.author);
    }
    cmd.toEmoteList = function () {
        var list = [];
        var output = '';

        for (let name in cmd.emojis)
            list.push(name);
        list.sort();

        for (let i in list) {
            if (`${output}<:${list[i]}:${cmd.emojis[list[i]]}> `.length >= 2000) {
                cmd.sendEmbed(`List of emotes`, output, cmd.msg.author);
                output = '';
            }
            if (!list[i - 1] || list[i].substring(0, 1) != list[i - 1].substring(0, 1))
                output += `\n\`\`${list[i].substring(0, 1)}:\`\``;
            output += `<:${list[i]}:${cmd.emojis[list[i]]}>`;
        }
        cmd.sendEmbed(`List of emotes`, output, cmd.msg.author);
    }
    cmd.toEmoteListByServer = function () {
        var guilds = cmd.bot.guilds.array();

        listGuildEmotes(0);

        function listGuildEmotes(i) {
            var emoji = guilds[i].emojis.array().sort();
            var list = '';
            var l = guilds.length;

            for (j in emoji) {
                list += `<:${emoji[j].name}:${emoji[j].id}> `
            }
            cmd.sendEmbed(`[${parseInt(i) + 1}/${l}] List of emotes from ${guilds[i].name} server`, list, cmd.msg.author);
            if (i < l-1) {
                setTimeout(() => {
                    var j = i + 1;
                    listGuildEmotes(j);
                }, 1500);
            }
        }
    }
    cmd.toServerList = function () {
        var guilds = cmd.bot.guilds.array();
        var output = '';
        for (i in guilds)
            output += `\n__${guilds[i].name}__\n` +
                `\`\`- Owner:\`\` ${guilds[i].owner.user.username}\n` +
                `\`\`- ID:\`\` ${guilds[i].id}\n`;
        cmd.sendEmbed(`List of servers I'm in`, output, cmd.msg.author);
    }

    //sending stuffs
    cmd.sendEmbed = function (title, content, channel) {
        const Discord = require('discord.js');
        var embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(`0xFDC000`)
            .setDescription(content);
        channel.send({ embed });
    };
}