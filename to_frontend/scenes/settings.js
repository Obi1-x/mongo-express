//SETTINGS SCENE

const { Scenes, session } = require("telegraf");
const boards = require("../boardsNbuttons");
const _texts = require("../stringTemplates");

const Scene = Scenes.BaseScene;
const inSettings = new Scene("settings");
const { leave } = Scenes.Stage;

inSettings.enter(async (ctx) => console.log("In setting scene"));

inSettings.hears("menu", leave());

inSettings.leave(async (ctx) => {
  await ctx.reply("Switching to main menu");
  await ctx.scene.leave();
});


module.exports = inSettings;