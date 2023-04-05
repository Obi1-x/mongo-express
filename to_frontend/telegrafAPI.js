require('dotenv').config();

const botToken = process.env.BOT_TOKEN;
const hookUrl = process.env.HOOK_URL;

const { Telegraf } = require('telegraf');
const Scenes = require("telegraf").Scenes;
const session = require("telegraf").session;

const _texts = require('./stringTemplates');
const kBoards = require("./boardsNbuttons");  //require('../to_backend/dummyBase');

const memeScene = require("./scenes/memes"); // scene file 
const memeAddScene = require("./scenes/memeadd"); // scene file 
const settingsScene = require("./scenes/settings"); // scene file 

const bot = new Telegraf(botToken);

const stage = new Scenes.Stage([memeScene, memeAddScene, settingsScene]); // Register our scenes

var dbWriteCountdown; //Write to DB 5 seconds after being idle. Might change.
const updateDbFile = () => {
    kBoards.daBase.write_cmd();
    clearInterval(dbWriteCountdown);
}

bot.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(_texts.responseTime, ms);
    //dbWriteCountdown = setTimeout(kBoards.daBase.write_cmd, 8000); // Writes to DB file 9 seconds after last activity.
});

bot.use(session()); // Session middleware for local storage.
bot.use(stage.middleware()); // Stage middleware


bot.start((ctx) => {
    //kBoards.daBase.isAdmin(ctx.message.chat.id).then((anAdmin) => {
      /*  if (anAdmin.val()) { //Is an Admin.
            ctx.reply(_texts.welcome, kBoards.startBoardAdmin);
            console.log("Gotten admin: " + anAdmin.val());
            kBoards.daBase.dbLogs["Snapshot"] = anAdmin.val();
        } else if (!anAdmin.val()) ctx.reply(_texts.welcome, kBoards.startBoard);
        ctx.reply(_texts.mainM);*/
        kBoards.daBase.verifyUser(ctx.message.chat);
    //}).catch((err) => console.log(err))
});

//Method for requesting user's location
bot.command("appreciate", (ctx) => {
    ctx.reply(_texts.appreciation + ctx.from.first_name);
    //kBoards.daBase.pushMeme(1355311995, "https://twitter.com/Jeyjeffrey1/status/1566504571157053448?s=20", "The excuse of traffic never gets old.");
    console.log("Appreciate db write");

    kBoards.daBase.assignAdmin(ctx.message.chat.id, true);
});

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
  });


//bot.on("message", (ctx) => console.log(ctx.message.text));





//////////////////////////////ACTIONS.....

//Method for viewing meme.
bot.hears("😎 Memes", (ctx) => {
    ctx.scene.enter("memes"); // Enter the memes scene.
});

bot.hears("📝 Edit", (ctx) => {
    //Verify user auth
    kBoards.daBase.isAdmin(ctx.message.chat.id).then((theAdmin) => {
        if(theAdmin) ctx.scene.enter("memeadd"); // Enter the memeadd scene.
        else if(!theAdmin) ctx.reply(_texts.denyMemeAdd);
    });   
});

bot.hears("##Assign", (ctx) => {
    //Assign meme lord as admin.

    var firstAdmin = {
        "id": 1770541911,
        "first_name": 'Mean',
        "username": 'Chime22',
        "type": 'private'
    }
    kBoards.daBase.assignAdmin(firstAdmin.id, false);
});

module.exports = {bot, botToken, hookUrl, kBoards};