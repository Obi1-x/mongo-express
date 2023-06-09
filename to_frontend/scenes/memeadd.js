//MEME ADD SCENE

const { Scenes, session } = require("telegraf");
const boards = require("../boardsNbuttons");
const _texts = require("../stringTemplates");

const Scene = Scenes.BaseScene;
const addMeme = new Scene("memeadd");
const { leave } = Scenes.Stage;

var memeSessionIndex;

addMeme.enter(async (ctx) => {
    memeSessionIndex = 0;
    ctx.reply(_texts.editWelcome, boards.memeEditAdmin);
});

//addMeme.on("message", (ctx) => console.log(ctx.message.text));

//BUILT FOR ADDITIONS BY ONLY A SINGLE ADMIN.

addMeme.hears("➕ Add meme", (ctx) => { 
    ctx.reply(_texts.linkIn);

    addMeme.on("message", async(ctx) => {
        //Check which input is expected.
        const checkSess = ctx.session["link_" + memeSessionIndex];
        if (!checkSess) { //If link has not been set.
            //Check if text is a valid link.
            var link = String(ctx.message.text);
            if (link.startsWith("http")) { //startsWith(strinToSearch, indexToStartFrom);
                //Save link
                ctx.session["link_" + memeSessionIndex] = link;
                ctx.reply(_texts.descIn);
            } else ctx.reply(_texts.invalidLinkIn);
        }else if(checkSess){ //If link has been set.
            //Set description.
            ctx.session["desc_" + memeSessionIndex] = ctx.message.text;

            //Build meme Obj
            const memeLink = ctx.session["link_" + memeSessionIndex];
            const memeDesc = ctx.session["desc_" + memeSessionIndex];
            boards.daBase.pushMeme(ctx.message.chat.id, memeLink, memeDesc);
            ctx.reply(_texts.memeadd);

            /*
            //Clear session
            ctx.session = undefined
            delete ctx.session["link_" + memeSessionIndex];
            delete ctx.session["desc_" + memeSessionIndex];*/

            //Increase index
            memeSessionIndex++;

            //Clear listener
            //addMeme.off(message(), console.log("Offed Listener"));
            //addMeme.off()
        }
    });
});

addMeme.hears("🗑 Delete meme", (ctx) => {
    console.log("You are deleting a meme.");
});

addMeme.leave(async (ctx) => {
    boards.daBase.isAdmin(ctx.message.chat.id).then((anAdmin) => {
        ctx.reply(_texts.stopView);
        //viewingMemes = false;
        //delete ctx.session.index; // Delete session field
        //delete ctx.session.movies; // Delete session field

        if (anAdmin) ctx.reply(_texts.mainM, boards.startBoardAdmin);
        else if (!anAdmin) ctx.reply(_texts.mainM, boards.startBoard);

        console.log(ctx.session);
        delete ctx.session; // = undefined; //Clear session
        ctx.scene.leave();
    }).catch((err) => console.log("This error occured while swtich back to main scene.", err));
});

addMeme.hears("🔙 Back", leave());


module.exports = addMeme;