//MEME SCENE

const { Scenes, session } = require("telegraf");
const boards = require("../boardsNbuttons");
const _texts = require("../stringTemplates");

const Scene = Scenes.BaseScene;
const inMemes = new Scene("memes");
const { leave } = Scenes.Stage;

var swipePrompt, postedMemeId, page; //Replace with a way to transfer context or so.

inMemes.enter(async (ctx) => {
    page = 0;
    const gottenMeme = boards.daBase.popMeme(page);
    if (gottenMeme) {
        const builtUrl = '<a href="' + gottenMeme.source + '">' + gottenMeme.description + "</a>";

        ctx.replyWithHTML(builtUrl, boards.memeInlineBoard).then((e) => {
            postedMemeId = e.message_id;
        });
        ctx.reply(_texts.viewing, boards.memeViewBoard).then((d) => {
            swipePrompt = d.message_id;
        });
    }else ctx.reply(_texts.lastMeme);
});


inMemes.action('like', (ctx) => {
    console.log("I like");
});

inMemes.action("dislike", (ctx) => {
    console.log("I dislike");
});


inMemes.hears('➡️ Next', async (ctx) => { //Next button will take you to the next meme and delete current meme.
    var poolSize = boards.daBase.getMemePoolSize();
    if ((page + 1) < poolSize) {
        page++;
        try {
            ctx.deleteMessage(postedMemeId);
            ctx.editMessageText(swipePrompt, _texts.next);
        } catch (err) {
            console.log(_texts.messageError);
        }

        const gottenMeme = boards.daBase.popMeme(page);
        const builtUrl = '<a href="' + gottenMeme.source + '">' + gottenMeme.description + "</a>";
        ctx.replyWithHTML(builtUrl, boards.memeInlineBoard).then((e) => {
            postedMemeId = e.message_id;
        });
    } else ctx.reply(_texts.lastMeme);
    
    //TODO: Implement paging.
    //ctx.reply(_texts.lastMeme);
});

inMemes.hears("⬅️ Prev", async (ctx) => {
    if(page != 0){
        page--;
        try {
            ctx.deleteMessage(postedMemeId);
            ctx.editMessageText(swipePrompt, _texts.prev);
        } catch (err) {
            console.log(_texts.messageError);
        }

        const gottenMeme = boards.daBase.popMeme(page);
        const builtUrl = '<a href="' + gottenMeme.source + '">' + gottenMeme.description + "</a>";
        ctx.replyWithHTML(builtUrl, boards.memeInlineBoard).then((e) => {
            postedMemeId = e.message_id;
        });
    }
    else ctx.reply(_texts.lastMeme);

    //TODO: Implement paging.
    //ctx.reply(_texts.lastMeme);
});

inMemes.hears("⏹ Stop", leave());

inMemes.leave(async (ctx) => {
  await ctx.reply(_texts.stopView, boards.userControl(ctx.message.chat.id));
  ctx.reply(_texts.mainM);
  //viewingMemes = false;
  //delete ctx.session.index; // Delete session field
  //delete ctx.session.movies; // Delete session field
  await ctx.scene.leave();
});


module.exports = inMemes;