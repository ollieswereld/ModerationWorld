const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const client = new discord.Client();
client.login(process.env.token);

client.on('ready', () => {

    console.log(`${client.user.username} is online.`);
    let activities = [ `${client.guilds.cache.size} servers`], i = 0;

  setInterval(() => client.user.setActivity(`!help | ${activities[i ++ % activities.length]}`, { type: "WATCHING"}),`${process.env.INTERVAL}`)
});

client.on("message", async message => {

    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if (command === `${prefix}cum`) {
        return message.channel.send("Daneric en Tim zijn verliefd 😱")
    }

    if (command === `${prefix}serverinfo`) {
        
        var botEmbed = new discord.MessageEmbed()
            .setTitle("**SERVER INFORMATION**")
            .setColor("#00ff00")
            .addFields(
                {name: "server name:", value: message.guild.name},
                {name: "You joined this server at:", value: message.member.joinedAt},
                {name: "Total members:", value: message.guild.memberCount}
            )
            .setFooter("ModerationWorld", "https://imgur.com/30UJ0YR.jpg")
            .setTimestamp();

        return message.channel.send(botEmbed); 
    }


    if (command === `${prefix}kick`) {

        // !kick @spelerNaam redenen hier

        var args = message.content.slice(prefix.length).split(/ +/);

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You don't have the perms to do that!");

        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("I have no perms!");

        if(!args[1]) return message.reply("Please mention a user!");

        if(!args[2]) return message.reply("Please give a reason!");

        var kickUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if(!kickUser) return message.reply("User not found!");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Please react within 30 seconds")
            .setDescription(`Do you want to kick ${kickUser}?`);

        var embed = new discord.MessageEmbed()
            .setColor("#FF0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Kicked: ** ${kickUser} (${kickUser.id})
            **Kicked by:** ${message.author}
            **Reason: ** ${reason}`);

         message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅") {

                msg.delete();

                kickUser.kick(reason).catch(err => {
                    if (err) return message.reply("There is an error");
                });

                message.channel.send(embed);
 
            } else if(emoji === "❌") {

                msg.delete();

                message.reply("Kick canceled").then(m => m.delete(5000));

            }

         })

    };

    if (command === `${prefix}ban`) {

        // !kick @spelerNaam redenen hier

        var args = message.content.slice(prefix.length).split(/ +/);

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You don't have the perms to do that!");

        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply("I have no perms!");

        if(!args[1]) return message.reply("Please mention a user!");

        if(!args[2]) return message.reply("Please give a reason!");

        var kickUser = message.guild.member(message.mentions.users.first()  || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if(!kickUser) return message.reply("User not found!");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Please react within 30 seconds")
            .setDescription(`Do you want to kick ${kickUser}?`);

        var embed = new discord.MessageEmbed()
            .setColor("#FF0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Kicked: ** ${kickUser} (${kickUser.id})
            **Kicked by:** ${message.author}
            **Reason: ** ${reason}`);

         message.channel.send(embedPrompt).then(async msg => {

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅") {

                msg.delete();

                kickUser.ban({ "reason": reason }).catch(err => {
                    if (err) return message.reply("There is an error");
                });

                message.channel.send(embed);
 
            } else if(emoji === "❌") {

                msg.delete();

                message.reply("Kick canceled").then(m => m.delete(5000));

            }

         })

    };
});


async function promptMessage(message, author, time, reactions) {

    time *= 1000;

    for(const reaction of reactions) {
        await message.react(reaction);
    }

    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, { max:1, time: time }).then(collected => collected.first() && collected.first().emoji.name);

}