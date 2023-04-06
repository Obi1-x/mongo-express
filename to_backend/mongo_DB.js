require('dotenv').config();

var logBox = {};


const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.DB_URL_2, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
var connectionInstance, menaceDB;

const dbConnect = () => {
    console.log("Connecting to MongoDB Atlas cluster...");
    client.connect().then((connected) => {
        connectionInstance = connected;
        menaceDB = connected.db("menace_db");  //REMEMBER TO SAVE DB AND COLLECTIONS NAMES IN THE .ENV FILE
        
        //menaceDB.collection("users").find()
        console.log("Database connected!");
        logBox["dbConnect"] = `DB connected on ${new Date().getTime()}`;
    }).catch((error) => console.log("This error occured while trying to connect to DB:", error));
}
//dbConnect();













//========================================DB QUERIES.
const getAdmin = async (adminId) => {
    logBox["lastLog"] = `Get admin ${adminId} on ${new Date().getTime()}`;
    console.log("Getting admin: ", adminId);
    return menaceDB.collection("users").findOne({ ID: adminId }); //change to admin.
}

const setAdmin = (adminId, admin) => {}




const getUser = async (userId) => {
    logBox["lastLog"] = `Get user ${userId} on ${new Date().getTime()}`;
    console.log("Getting user: ", userId);
    return menaceDB.collection("users").findOne({ ID: userId });
}

const setUser = async (user) => {
    logBox["lastLog"] = `Set user ${user.ID} on ${new Date().getTime()}`;
    return menaceDB.collection("users").insertOne(user);
}




const getMeme = async (memeIndex) => {}

const setMeme = async (aMeme) => {}


const memePoolSize = async() => {}




const establishConnection = () => {
    var message;
    if(menaceDB) message = "DB connected";
    else if(!menaceDB) {
        dbConnect();
        message = "Connecting DB";
    }
    return message
}

const closeConnection = () => {
    var message;
    if (!connectionInstance) message = "No DB present";
    else if (connectionInstance) {
        try {
            connectionInstance.close().then((closed) => {
                console.log("DB connection closed", closed);
                logBox["Close DB"] = "DB connection closed" + closed;
            });
        } catch (error) {
            console.log("This error occured while trying to close DB", error);
            logBox["Close DB"] = "This error occured while trying to close DB" + error;
        }
        message = "Closing DB...";
    }
    return message;
}



module.exports = {
    getUser,
    setUser,
    getAdmin,
    setAdmin,
    getMeme,
    setMeme,
    memePoolSize,
    logBox,
    establishConnection,
    closeConnection
};