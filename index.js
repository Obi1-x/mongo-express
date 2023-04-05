require('dotenv').config(); //Try removing this

const express = require('express'); //returns a function
const app = express(); //Returns an object of type Express
app.use(express.json()); //Allows our server to accept JSON parsing as a body in POST command or so.

const router = express.Router();
app.use('/random', router);

//const serverless = require('serverless-http');


const bot_Import = require('./to_frontend/telegrafAPI');
const botMod = bot_Import.bot;
const bToken = bot_Import.botToken;
const _url = bot_Import.hookUrl;

const repo = bot_Import.kBoards.daBase;

//botMod.telegram.setWebhook(_url + bToken); // Run this once to connect the webhook.
//router.use(botMod.webhookCallback("/" + bToken));
//botMod.startWebhook("/" + bToken, null, null); //To start the webhook.


router.get('/', async (req, res) => {
    console.log("Welcome to the main endpoint!");
    res.status(200).send("Hello World, Welcome to my Lambda function endpoint.");
});

router.get('/logs', async (req, res) => {
    console.log("Logs endpoint!");
    res.send(repo.dbLogs);
});



router.get('/dbread', async (req, res) => {
    var aUser = {
        "id": 1355312020,
        "first_name": "Drake",
        "username": "eminem",
        "type": "private"
    }

    console.log("DB endpoint!", "Reading DB...");
    repo.verifyUser(aUser).then((T) => {
        res.status(200).send(`User verified ${T}`);
    });
    //res.send(`Read complete wrote`);
});

router.get('/dbconnect', async (req, res) => {
    console.log("DB endpoint!", "Connecting to DB...");
    const response = await repo.connectDB();
    res.status(200).send(response);
});

router.get('/dbdisconnect', async (req, res) => {
    console.log("DB endpoint!", "Disconnecting DB...");
    const response = await repo.disconnectDB();
    res.status(200).send(response);
});
/*
router.get('/dbwrite', async (req, res) => {
    console.log("DB endpoint!", "Writing to DB...");
    res.send(`Write complete`);
});*/


module.exports = app;
//module.exports.handler = serverless(app);

/*
const port = 8085;
app.listen(port, () => console.log(`Listening at ${port}`));
botMod.launch();*/