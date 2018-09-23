var DEBUG = false;
var command_prefix = DEBUG?'$':'!';
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
var no2name = require("./data/no2name.json");
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
function cp(a,d,s,ia,id,is,lv){
    var result = parseInt((a + ia) * Math.sqrt(d + id) * Math.sqrt(s + is) * Math.pow(cpm[lv], 2) * 0.1);
    if(result<10){
        result = 10;
    }
    return result;
}
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === command_prefix) {
        var args = message.toLowerCase().substring(1).split(' ');
        var name = args[0];
        var mode = "chart";
        if(name==="search"||name==="trash"){
            mode = name;
            name = args[1];
        }
        var stats = basestats;
        if (args.indexOf("alolan") !== -1) {
            stats = alolan;
        }
        var checkNumber = Number(name);
        if(checkNumber != NaN && checkNumber>=0 && checkNumber<= 386){
            name = no2name[checkNumber];
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
            var msg = "Possible 100iv CPs for " + name.substring(0,1).toUpperCase() + name.substring(1) + ": \n```\n";
            var atk = stats[name]["atk"];
            var def = stats[name]["def"];
            var hp = stats[name]["hp"];
            var all = false;
            var step = 1;
            var maxlvl = 35;
            if(mode==="chart" && args.indexOf("all")!==-1){
                all = true;
                maxlvl = 40;
            }
            if(mode==="chart" && args.indexOf("halflvl")!==-1){
                all = true;
                maxlvl = 40;
                step = 0.5;
            }
            if(all ||  mode!=="chart" || stats[name]["wild"]===true){
                for (var i = 1; i <= maxlvl; i+=step) {
                    ivs.push(cp(atk, def, hp, 15, 15, 15, i));
                }
                switch (mode) {
                    case "chart":
                        for(var i=0;i<ivs.length;++i){
                            msg = msg + ivs[i] + " ";
                            if(i%5===4){
                                msg = msg + "\n";
                            }
                            if(i===29 && all===false){
                                msg = msg + "Weather boosted:\n";
                            }
                        }
                        msg = msg + "```\n";
                        break;
                    case "search":
                        msg = "" + stats[name]["no"] + "&";
                        for(var i=0;i<ivs.length;++i){
                            if(ivs[i]==ivs[i+1]){
                                continue;
                            }
                            msg = msg + "cp" + ivs[i];
                            if(i!==ivs.length-1){
                                msg = msg + ',';
                            }
                        }
                        break;
                    case "trash":
                        msg = "" + stats[name]["no"] + "&";
                        if(ivs[0]==11){
                            msg = msg + "cp10,";
                        }
                        if(ivs[0]>11){
                            msg = msg + "cp10-" + (ivs[0]-1) + ",";
                        }
                        for(var i=0;i<ivs.length-1;++i){
                            if(ivs[i]==ivs[i+1]){
                                // magikarp and feebas
                                continue;
                            }
                            msg = msg + "cp" + (ivs[i]+1) + "-" + (ivs[i+1]-1);
                            if(i!==ivs.length-2){
                                msg = msg + ',';
                            }
                        }
                        break;
                }
            }else{
                msg = msg + "*No possible wild encounter\n";
                if(stats[name]["task"]===true){
                    msg = msg + "Research Task: " + cp(atk, def, hp, 15, 15, 15, 15) + "\n";
                }
                if(stats[name]["raid"]===true){
                    msg = msg + "Raid: " + cp(atk, def, hp, 15, 15, 15, 20) + "\n";
                    msg = msg + "Raid Weather Boosted: " + cp(atk, def, hp, 15, 15, 15, 25) + "\n";
                }
                msg = msg + "```\n";
            }
            if(mode==="search"||mode==="trash"){
                bot.sendMessage({
                    to: channelID,
                    message: "Note this only shows lvl 1-35 and whole lvls due to discord single message length limit.\n" +
                        "Mostly for use during community days. \n" +
                        "iOS trainers need to set text replacement since pasting into search bar is not possible."
                });
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