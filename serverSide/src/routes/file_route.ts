import express from "express";
const router = express.Router();
import multer from "multer";


//const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
const base = "http://localhost:3000/";

const storage = multer.diskStorage ({

    //Returns the directory where we will save the file
    destination : function (req, file, cb) {
        cb(null, 'public/')
    },

    //Defines what will be the name of the file where the new file they received will be saved
    filename: function (req, file, cb) {
        const ext = file.originalname .split('.')
            .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})

const upload = multer({ storage: storage });


//Uploads the image to public on the server
//And in the answer he returns the URL with which the image can be accessed
router.post('/file', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + req.file.path)
    res.status(200).send({ url: base + req.file.path })
});
export = router;