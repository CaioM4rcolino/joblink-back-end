
var admin = require("firebase-admin");
var serviceAccount = require("../config/firebase-key");


const bucketAdress = "joblinkproject.appspot.com";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketAdress,
});

const bucket = admin.storage().bucket();

const uploadImagem = (req, res, next) => {

    if (!req.file) {
        return next();
    }

    const image = req.file;

    const fileName = Date.now() + "." + image.originalname.split(".").pop();

    let file;
    let filePath;
    
    switch(req.route.path){
        case "/posts":
            filePath = "post-images/";
            file = bucket.file(filePath + fileName);
            break;

        case "/clients":
            filePath = "clients-profile-pictures/";
            file = bucket.file(filePath + fileName);
            break;

        case "/freelancers":
            filePath = "freelancers-profile-pictures/";
            file = bucket.file(filePath + fileName);
            break;
    }

    const stream = file.createWriteStream({

        metadata: {
            contentType: image.mimetype,
        },

    });

    stream.on("error", (e) => {
        console.error(e)
    });

    stream.on("finish", async () => {

        await file.makePublic();

        req.file.fileName = fileName;

        req.file.firebaseUrl = `https://storage.googleapis.com/${bucketAdress}/${filePath}${fileName}`;

        console.log("aqui-----",req.file)

        next();

    });

    stream.end(image.buffer)

}

module.exports = uploadImagem;