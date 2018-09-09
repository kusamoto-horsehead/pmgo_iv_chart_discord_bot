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
function cp(a,d,s,lv){
    var result = parseInt((a + 15) * Math.sqrt(d + 15) * Math.sqrt(s + 15) * Math.pow(cpm[lv], 2) * 0.1);
    if(result<10){
        result = 10;
    }
    return result;
}
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
        // Special Filters
        if(name==="nidoran"){
            if(args[1]===("f")){
                name="nidoran_f";
            }else if(args[1]==="m"){
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
            var msg = "Possible CPs: \n```\n";
            var atk = stats[name]["atk"];
            var def = stats[name]["def"];
            var hp = stats[name]["hp"];
            var all = false;
            var step = 1;
            var maxlvl = 35;
            if(args.indexOf("all")!==-1){
                all = true;
                maxlvl = 40;
            }
            if(args.indexOf("halflvl")!==-1){
                all = true;
                maxlvl = 40;
                step = 0.5;
            }
            if(all || stats[name]["wild"]===true){
                for (var i = 1; i <= maxlvl; i+=step) {
                    ivs.push(cp(atk, def, hp, i));
                }
                for(var i=0;i<ivs.length;++i){
                    msg = msg + ivs[i] + " ";
                    if(all===false&&i%5===4){
                        msg = msg + "\n";
                    }
                    if(i===29 && all===false){
                        msg = msg + "Weather boosted:\n";
                    }
                }
                msg = msg + "```\n";
            }else{
                msg = msg + "*No possible wild encounter\n";
                if(stats[name]["task"]===true){
                    msg = msg + "Research Task: " + cp(atk, def, hp, 15) + "\n";
                }
                if(stats[name]["raid"]===true){
                    msg = msg + "Raid: " + cp(atk, def, hp, 20) + "\n";
                    msg = msg + "Raid Weather Boosted: " + cp(atk, def, hp, 25) + "\n";
                }
                msg = msg + "```\n";
            }
            bot.sendMessage({
                to: channelID,
                message: msg
            });
        } else {
            bot.sendMessage({
                to: channelID,
                message: message.substring(1) + " not found"
            });
        }
    }
});