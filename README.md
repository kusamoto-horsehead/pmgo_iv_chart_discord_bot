# Cheatsheet

### basics
* For wild encouter 100iv cp chart `!slowbro`  `!145`
* For community day search bar search/trash string `!search chikorita` `!trash chikorita`
### misc
* Everything is case INsensitive (The bot will toLowerCase() them all)
* Raid / Research exclusive will only display possible encountered values 
* For checking all 40 lvls `!moltres all`
* For checking all possible values including half lvls `!feebas halflvl` 
### special pokemons
* For Nidoran `!nidoran m` `!nidoran f`
* For Alolan form `!exeggutor alolan`


# How To Install
* Download and install [node.js](https://nodejs.org/en/)
* Download zip file, unzip to a folder
* Navigate to the folder in command line (try ` shift + right click` in explorer), run:

`npm install discord.io winston –save`

`npm install https://github.com/woor/discord.io/tarball/gateway_v6`

* Create an application [here](https://discordapp.com/developers/applications/)
* In the application created, go to Bot > Add Bot
* Copy the token, put it in auth.json, replacing "YOUR TOKEN HERE"

# How To Add To Server
* In the application management page found client id
* Replace the CLIENTID in this url and open in browser

`https://discordapp.com/oauth2/authorize?&client_id=CLIENTID&scope=bot&permissions=8`

*I'll look into the permissions and give him a lower one later 

# How To Run
* Navigate to the folder in command line (try ` shift + right click` in explorer), run:

`node bot.js`

# Also Check
[How to make a Discord bot | Digital Trends](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/)