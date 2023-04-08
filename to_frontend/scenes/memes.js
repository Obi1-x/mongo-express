//MEME SCENE

const { Scenes, session } = require("telegraf");
const boards = require("../boardsNbuttons");
const _texts = require("../stringTemplates");

const Scene = Scenes.BaseScene;
const inMemes = new Scene("memes");
const { leave } = Scenes.Stage;

var swipePrompt, postedMemeId; //Replace with a way to transfer context or so.
var page; //Persist page to the DB.

inMemes.enter(async (ctx) => {
    page = 0;
    boards.daBase.popMeme(page).then((gottenMeme) =>{
        if (gottenMeme) {
            const builtUrl = '<a href="' + gottenMeme.source + '">' + gottenMeme.description + "</a>";
    
            ctx.replyWithHTML(builtUrl, boards.memeInlineBoard).then((e) => {
                postedMemeId = e.message_id;
            });
        }else ctx.reply(_texts.lastMeme);
    }).catch((er) => console.log("This error occured while fetching a meme:", er));

    ctx.reply(_texts.viewing, boards.memeViewBoard).then((d) => {
        swipePrompt = d.message_id;
    });
});


inMemes.action('like', (ctx) => {
    console.log("I like");
});

inMemes.action("dislike", (ctx) => {
    console.log("I dislike");
});


inMemes.hears('➡️ Next', async (ctx) => { //Next button will take you to the next meme and delete current meme.
    boards.daBase.getMemePoolSize().then((poolSize) => {
        if (poolSize && (page + 1) < poolSize) {
            page++;
            try {
                ctx.deleteMessage(postedMemeId);
                ctx.editMessageText(swipePrompt, _texts.next);
            } catch (err) {
                console.log(_texts.messageError);
            }

            boards.daBase.popMeme(page).then((gottenMeme) => {
                const builtUrl = '<a href="' + gottenMeme.source + '">' + gottenMeme.description + "</a>";
                ctx.replyWithHTML(builtUrl, boards.memeInlineBoard).then((e) => {
                    postedMemeId = e.message_id;
                });
            }).catch((er) => console.log("This error occured while fetching a meme:", er));
        } else ctx.reply(_texts.lastMeme);
    });
    
    //TODO: Implement paging.
    //ctx.reply(_texts.lastMeme);
});

inMemes.hears("⬅️ Prev", async (ctx) => {
    if (page > 0) {
        page--;
        try {
            ctx.deleteMessage(postedMemeId);
            ctx.editMessageText(swipePrompt, _texts.prev);
        } catch (err) {
            console.log(_texts.messageError);
        }

        boards.daBase.popMeme(page).then((gottenMeme) => {
            const builtUrl = '<a href="' + gottenMeme.source + '">' + gottenMeme.description + "</a>";
            ctx.replyWithHTML(builtUrl, boards.memeInlineBoard).then((e) => {
                postedMemeId = e.message_id;
            });
        }).catch((er) => console.log("This error occured while fetching a meme:", er));
    }
    else ctx.reply(_texts.lastMeme);

    //TODO: Implement paging.
    //ctx.reply(_texts.lastMeme);
});

inMemes.hears("⏹ Stop", leave());

inMemes.leave(async (ctx) => {
    boards.daBase.isAdmin(ctx.message.chat.id).then((anAdmin) => {
        ctx.reply(_texts.stopView);
        //viewingMemes = false;
        //delete ctx.session.index; // Delete session field
        //delete ctx.session.movies; // Delete session field

        if (anAdmin) ctx.reply(_texts.mainM, boards.startBoardAdmin);
        else if (!anAdmin) ctx.reply(_texts.mainM, boards.startBoard);
        ctx.scene.leave();
    }).catch((err) => console.log("This error occured while swtich back to main scene.", err)); //AN ERROR EXISTS
});


module.exports = inMemes;