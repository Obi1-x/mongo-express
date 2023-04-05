//const daBase = require('../to_backend/repository');
const daBase = require('../to_backend/dummyBase_3');
const Markup = require('telegraf').Markup;

//Make keyboard collapsible.

const startBoard = Markup.keyboard([ ["📚 Category", "😎 Memes", "❤️ Likes"], ["⚙ Settings", "💬 Feedback"] ]).resize()

const startBoardAdmin = Markup.keyboard([ ["📚 Category", "😎 Memes", "❤️ Likes"], ["📝 Edit", "💬 Feedback", "⚙ Settings" ] ]).resize()


const memeViewBoard = Markup.keyboard([ ["⬅️ Prev", "⏹ Stop", "➡️ Next"] ]).resize()

const memeEditAdmin = Markup.keyboard([ ["➕ Add meme", "🗑 Delete meme"], ["🔙 Back"] ]).resize()

const memeInlineBoard = Markup.inlineKeyboard([
    [
        Markup.button.callback("👎 Dislike", "dislike"),
        Markup.button.callback("👍 Like", "like")
    ]
])

/*
const userControl = async (anId) => {
    const fromDB = await daBase.isAdmin(anId);
    return fromDB.once('value');
}*/

module.exports = {
    daBase,
    startBoard,
    startBoardAdmin,
    memeViewBoard,
    memeEditAdmin,
    memeInlineBoard
 }