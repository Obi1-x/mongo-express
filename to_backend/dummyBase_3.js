//const detaDB = require('./detaBASE');
//const fbDB = require('./fb_DB');
const mongoDB = require('./mongo_DB');
const dbLogs = mongoDB.logBox;

//======================================= SCHEMAs
class UserInfo{
    constructor(user_name, first_name, id) {
        this.userName = user_name;
        this.firstName = first_name;
        this.ID = id;
        this.entryDate = new Date().getTime();
    }
 }

 class AdminInfo{
    constructor(creator) {
        this.dateAssigned = new Date().getTime();
        this.isCreator = creator;
    }
 }

 class Meme{
    constructor(_creator, src, desc){
        this.timeAdded = new Date().getTime();
        this.addedBy = _creator; //Count;
        this.source = src; //Memesource file.
        this.description = desc; //Meme description
    }
 }
 //==================================================== SCHEMAs END.


//=================================== DB QUERIES
const registerUser = (aUser) => {
    const newUser = new UserInfo(aUser.username, aUser.first_name, aUser.id);
    //Main registration
    mongoDB.setUser(newUser).then((result) => {
        console.log("Object inserted ID:", result.insertedId);
        if (result) {
            dbLogs["Register user"] = `User added! Db _id: ${result.insertedId}`;
            console.log("User added! Db _id:", result.insertedId);
        }
        else if(!result){
            dbLogs["Register user"] = "This error occured: " + error;
            console.log("An error occurred");
        }
    }).catch((error) => {
        dbLogs["Register user"] = "This error occured: " + error;
        console.log("This error occured: ", error);
    });
}


const verifyUser = async (aUser) => {
    //Get user inform from db.
    try {
        const unknownUser = await mongoDB.getUser(aUser.id);

        if (unknownUser) {
            console.log("User data already exists");
            dbLogs["User data"] = unknownUser;
            console.log("User info: ", unknownUser);
            return "Verified";
        }
        else if (!unknownUser) {
            dbLogs["User data"] = "User not detected.";
            console.log("User not detected.");
            registerUser(aUser);
        }

    } catch (err_r) {
        dbLogs["Caught error"] = err_r;
        console.log("Error caught while verifying user", err_r);
    }
}


const assignAdmin = async (adminId, isCreator) => { //Set this manually or get admin data from telegraf API if avaialable.
    mongoDB.setAdmin(String(adminId), new AdminInfo(isCreator)).then((err) => {
        if (err) {
            dbLogs["Assigned admin"] = "This error occured: " + err;
            console.log("An error occurred.");
        }
        else if(!err){
            dbLogs["Assigned admin"] = "Admin added.";
            console.log("Admin added.");
        }
        return err;
    }).catch((error) => {
        dbLogs["Assign admin"] = "This error occured: " + error;
        console.log("This error occured: ", error);
    });
}


const isAdmin = async (adminId) => {
    //Verification from DB.
    console.log("Looking for admin");
    const checking = await mongoDB.getAdmin(adminId);
    return checking.once('value');
}


const pushMeme = (creator, source, desc_) => {
    var newMeme = new Meme(creator, source, desc_);

    //appData.memes.push(newMeme);
    mongoDB.setMeme(newMeme);
}

const popMeme = (index) => {
    //return appData.memes[index];
    return mongoDB.getMeme();
}

const getMemePoolSize = () => {
    return mongoDB.memePoolSize();
}





const connectDB = () => {
    return mongoDB.establishConnection();
}

const disconnectDB = () => {
    return mongoDB.closeConnection();
}

/*
const testRetrieve = async () => {
    var aUser = {
        "id": 1355311995,
        "first_name": "Phenomenal",
        "username": "eizeko",
        "type": "private"
    }

    const unknownUser = await fbDB.getUser(aUser.id);
    unknownUser.once('value').then(async (snapshot) => {
        if (snapshot.val()) {
            console.log("User exists");
            dbLogs["Snapshot"] = snapshot.val();
            console.log("User info: ", snapshot.val());
            //fbDB.freeResources();
            return snapshot.val();
        } else if (!snapshot.val()) {
            dbLogs["Snapshot"] = "User not detected.";
            console.log("User info: ", snapshot.val());
            //fbDB.freeResources();
            return "Nothing found";
        }
    }).catch((error) => {
        dbLogs["Verify user"] = "This error occured: " + error;
        console.log("This error occured: ", error);
    });
}

const testSend = () => {
    var theOwner = {
        "id": 1355311995,
        "first_name": "Phenomenal",
        "username": "eizeko",
        "type": "private"
    }
    
    var firstAdmin = {
        "id": 1770541911,
        "first_name": 'Mean',
        "username": 'Chime22',
        "type": 'private'
    }

    registerUser(theOwner);
}

const testGetAdmin = async () => {
    var theOwner = {
        "id": 1355311995,
        "first_name": "Phenomenal",
        "username": "eizeko",
        "type": "private"
    }
    
    var firstAdmin = {
        "id": 1770541911,
        "first_name": 'Mean',
        "username": 'Chime22',
        "type": 'private'
    }

    isAdmin(theOwner.id).then((anAdmin) => {
        if (anAdmin.val()) { //Is an Admin.
            console.log("Gotten admin: " + anAdmin.val());
            dbLogs["Snapshot"] = anAdmin.val();
            return anAdmin.val();
        } else if (!anAdmin.val()) {
            console.log("Gotten admin: ", "Nothing returned");
            return "Admin not found";
        }
    }).catch((err) => console.log(err))
}


const testSetAdmin = async () => {
    var theOwner = {
        "id": 1355311995,
        "first_name": "Phenomenal",
        "username": "eizeko",
        "type": "private"
    }
    
    var firstAdmin = {
        "id": 1770541911,
        "first_name": 'Mean',
        "username": 'Chime22',
        "type": 'private'
    }

    return assignAdmin(theOwner.id, true);
}*/
//=======================================================DB QUERIES END.


//=================================== DB INITs
/*
function initDB(){
    const dummyUser = {
        "id": 1355312007,
        "first_name": "Eminem",
        "username": "slimShady",
        "type": "private"
    }
    registerUser(dummyUser);
}
initDB();

var theOwner = {
    "id": 1355311995,
    "first_name": "Phenomenal",
    "username": "eizeko",
    "type": "private"
}

var firstAdmin = {
    "id": 1770541911,
    "first_name": 'Mean',
    "username": 'Chime22',
    "type": 'private'
}*/

//assignAdmin(theOwner.id, true);
//assignAdmin(firstAdmin.id, false);

//pushMeme(1355311995, "https://picsum.photos/200/300/", "Testing... A beautiful photo.");
//pushMeme(1355311995, "https://twitter.com/Jeyjeffrey1/status/1566504571157053448?s=20", "The excuse of traffic never gets old.");

/*
isAdmin("1355311995").then((anAdmin) => {
    if (anAdmin.val()) { //Is an Admin.
        console.log("\nGotten admin: " + Object.values(anAdmin.val()));
        dbLogs["Snapshot"] = anAdmin.val();
    } else if (!anAdmin) {
        dbLogs["Snapshot"] = "Failed to fetch admin";
        console.log("Failed to fetch admin");
    }
});*/
//=======================================================DB INiTs.


module.exports = {
    verifyUser,
    assignAdmin,
    isAdmin,
    pushMeme,
    popMeme,
    getMemePoolSize,
    dbLogs,
    connectDB,
    disconnectDB
}