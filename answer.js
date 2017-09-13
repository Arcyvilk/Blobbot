exports.Answer = function () {
    var answer = this;
    answer.msg = '';
    answer.commands = {};
    answer.emojis = {};
    answer.bot = '';

    //getters
    answer.getMessage = function (msg) {
        answer.msg = msg;
    }
    answer.getCommands = function (cmds) {
        answer.commands = cmds;
    }
    answer.getEmojis = function (emojis){
        answer.emojis = emojis;
    }
    answer.getBot = function (bot) {
        answer.bot = bot;
    }

    //technical stuffs
    answer.checkForCommands = function () {
        var cmd = answer.removeKeyword(answer.msg.content);

        if (answer.commands.hasOwnProperty(cmd))
            answer[answer.commands[cmd].response]();
    }
    answer.removeKeyword = function () {
        return answer.msg.content.substring(5).trim();
    }

    //commands themselves
    answer.toInfo = function () {
        var toSend = 'I am an emote bot. After adding me to any server I gain access to this server\'s emotes globally. ' +
            'If you try to use those emotes in any other server, I will resend your message with the original emotes attached.\n\n' +
            'If I have necesary permissions,  I will also change my nickname to one similar to yours and remove your original message to not break the flow of conversation.\n\n' +
            'I update my list emotes every 60 seconds.\n\n' +
            '**Commands:** ``blob!info`` | ``blob!list`` | ``blob!servers``\n' +
            `**Number of emotes:** ${Object.keys(answer.emojis).length}\n` +
            '**Webpage:** http://arcyvilk.com/blobbot/ \n' +
            '**Author:** <:arcyvilk:357190068797964298> \`\`Arcyvilk#5460\`\`';
        answer.sendEmbed('Info about Blobbot', toSend, answer.msg.author);
    }
    answer.toEmoteList = function () {
        var list = [];
        var m = '';
        
        for (name in answer.emojis)
            list.push(name);
        list.sort();

        for (i in list) {
            if (`${m}<:${list[i]}:${answer.emojis[list[i]]}> `.length >= 2000) {
                answer.sendEmbed(`List of emotes`, m, answer.msg.author);
                m = '';
            }
            if (!list[i - 1] || list[i].substring(0, 1) != list[i - 1].substring(0, 1))
                m += `\n\`\`${list[i].substring(0, 1)}:\`\``;
            m += `<:${list[i]}:${answer.emojis[list[i]]}>`;
        }
        answer.sendEmbed(`List of emotes`, m, answer.msg.author);
    }
    answer.toServerList = function () {
        var g = answer.bot.guilds.array();
        var m = '';
        for (i in g)
            m += `\n__${g[i].name}__\n` +
                `\`\`- Owner:\`\` ${g[i].owner.user.username}\n` +
                `\`\`- ID:\`\` ${g[i].id}\n`;
        answer.sendEmbed(`List of servers I'm in`, m, answer.msg.author);
    }
    answer.sendEmbed = function (title, content, channel) {
        const Discord = require('discord.js');
        var embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(`0xFDC000`)
            .setDescription(content);
        channel.send({ embed });
    };
}