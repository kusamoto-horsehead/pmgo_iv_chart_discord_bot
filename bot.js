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
    if (message.substring(0, 1) == '!') {
		name=message.substring(1);
        if(typeof(basestats[name])!="undefined"){
			var ivs = [];
			for(i=1;i<=30;i++){
				var atk = basestats[name]["atk"];
				var def = basestats[name]["def"];
				var hp = basestats[name]["hp"]
				ivs.push(parseInt((atk+15)*Math.sqrt(def+15)*Math.sqrt(hp+15)*Math.pow(cpm[i],2)*0.1))
			}
			ivs.push("weather boosted:");
			for(i=31;i<=35;i++){
				var atk = basestats[name]["atk"];
				var def = basestats[name]["def"];
				var hp = basestats[name]["hp"]
				ivs.push(parseInt((atk+15)*Math.sqrt(def+15)*Math.sqrt(hp+15)*Math.pow(cpm[i],2)*0.1))
			}
			bot.sendMessage({
                    to: channelID,
                    message: ivs.join()
                });
		}else{
			bot.sendMessage({
                    to: channelID,
                    message: name + " not found"
                });
		}
	}
});