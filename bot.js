var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
var basestats = require("./data/basestat.json");
var cpm = require("./data/cp_multipier.json");
var alolan = require("./data/alolan.json");
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '!') {
        var args = message.toLowerCase().substring(1).split(' ');
        var name = args[0].toLowerCase();
        var stats = basestats;
        if (args.indexOf("alolan") !== -1) {
            stats = alolan;
        }
        if(name==="nidoran"){
            if(args.indexOf("f") !== -1 && args.indexOf("m") === -1){
                name="nidoran_f";
            }else if(args.indexOf("f") === -1 && args.indexOf("m") !== -1){
                name="nidoran_m";
            }else{
                bot.sendMessage({
                    to: channelID,
                    message: 'Try "!nidoran f" and "!nidoran m"'
                });
                return;
            }
        }
        if(name==="nidoranf"){
            name="nidoran_f";
        }
        if(name==="nidoranm"){
            name="nidoran_m";
        }
        if (typeof(stats[name]) != "undefined") {
            var ivs = [];
            for (i = 1; i <= 35; i++) {
                var atk = stats[name]["atk"];
                var def = stats[name]["def"];
                var hp = stats[name]["hp"];
                ivs.push(parseInt((atk + 15) * Math.sqrt(def + 15) * Math.sqrt(hp + 15) * Math.pow(cpm[i], 2) * 0.1));
                if (i === 30) {
                    ivs.push("weather boosted:");
                }
            }
            bot.sendMessage({
                to: channelID,
                message: ivs.join()
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: message.substring(1) + " not found"
            });
        }
    }
});