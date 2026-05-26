const app = require('./src/app')
const http = require('http')
const socketIo = require('socket.io')
const mongoose = require('mongoose')
const multer = require('multer')
const ImageKit = require('@imagekit/nodejs')
const path = require('path')
const mongoDB = require('./src/database/db')
const { log } = require('console')
const jwt = require('jsonwebtoken');
require('dotenv').config();


const server = http.createServer(app);

const upload = multer({ storage: multer.memoryStorage() });


let unique_id = '';
let data_url = '';

// ========================================= SOCKET IO SERVER START =============================================

const io = new socketIo.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// ========================================= SOCKET IO SERVER END =============================================


// ========================================= MONGO DB SCHEMA START ============================================

const user_schema = new mongoose.Schema({
    user_id: String
});

const users_file_schema = new mongoose.Schema({
    file_title: String,
    file_url: String,
    unique_code: String,
    user_email:String
});

const signup_schema = new mongoose.Schema({
    email: String,
    password: String,
    number: String
});


// ========================================= MONGO DB SCHEMA END ============================================


// ========================================= MONGO DB MODEL START ============================================================

const userModel = mongoose.model("User_Id", user_schema, "User_Id");

const file_model = mongoose.model("Users_Files", users_file_schema, "Users_Files");

const signup_model = mongoose.model("User_SignUp", signup_schema, "User_SignUp");

// ========================================= MONGO DB MODEL END ============================================================



// ================================================= IMAGEKIT START =======================================================

const client = new ImageKit({
    privateKey:process.env.IMAGE_KIT_URL
})

async function uploadFile(buffer, FileExtension) {

    const result = await client.files.upload({
        file: buffer.toString("base64"),
        fileName: FileExtension
    })

    return result;
}

// ================================================= IMAGEKIT END =======================================================






// ================================================= POST API START =======================================================
app.post("/SendData", async (req, res) => {

    const socket_data = req.body.user_id;

    const newUser = new userModel({
        user_id: socket_data
    });
    await newUser.save()
})

app.post('/sendfile', upload.single('file_url'), async (req, res) => {

    const title = req.body
    const token = req.body.token
    const file_url = req.file

    const Token_secret_data = jwt.verify(token,process.env.JWT_SECRET_KEY);


    const FileExtension = path.extname(file_url.originalname);
    const result = await uploadFile(req.file.buffer, FileExtension)

    const string_code = "abc1def2ghi3jkl4mno5pqr6stu7vw8xyz9";
    let unique_code = "";

    try {
        for (let i = 1; i <= 6; i++) {

            const pic_string = Math.floor(Math.random() * 35);
            unique_code += string_code[pic_string];
        }

        const NewFileAdd = new file_model({
            file_title: title.file_title,
            file_url: result.url,
            unique_code: unique_code,
            user_email:Token_secret_data
        })

        res.status(201).send({
            message: "Uploaded"
        })

        await NewFileAdd.save();

    } catch {
        res.status(401).send({
            message: "Cancle Upload"
        })
    }

});

app.post('/signup', async (req, res) => {

    const { email, password, number } = req.body

    const Allready = await signup_model.findOne({ email: email })

    if (Allready) {
        res.status(200).send({
            message: "Email Already exist"
        })
    }

    if (!Allready) {
        const successful_signup = new signup_model({
            email,
            password,
            number
        })

        res.status(201).send({
            message: "Success"
        })

        await successful_signup.save();
    }
});


app.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user_check = await signup_model.findOne({ email: email })

    if (user_check) {

        if (password == user_check.password) {

            const token = jwt.sign(user_check.email,process.env.JWT_SECRET_KEY)

            res.status(200).send({
                token
            }) 
        } else {
            res.status(401).send({
                message: "Wrong Email Or Password"
            })
        }
    }
    
    else {
        res.status(404).send({
            message: "User Not Found"
        })

    }
})

app.post('/delete-data', async (req, res) => {
    const { id } = req.body

    await file_model.findByIdAndDelete({ _id: id })

    res.status(200).send({
        message: "File Deleted"
    })

})

app.post("/receiveData", async (req, res) => {

    const { user_id, user_file_url } = req.body

    try {

        if (user_id != '' && user_file_url != '') {

            io.to(user_id).emit("sendData", user_file_url)
        }

        res.status(200).send({
            message: "Receive"
        })

    }
    catch {
        res.status(404).send({
            message: "Failed"
        })
    }
})

// ================================================= POST API END =======================================================





// ================================================= GET API START =======================================================

app.get("/",(req,res)=>{
    res.send({
        message:"Server Start"
    })
})

app.get('/userdata/:email', async (req, res) => {
    const token = req.params.email

    const user_email = jwt.verify(token,process.env.JWT_SECRET_KEY)

    try {
        let data = await file_model.find({user_email:user_email});
        res.status(200).send({
            UserData: data
        })
    }
    catch {
        res.status(404).send({
            message: "Somethink Is Wrong"
        })
    }

})

app.get('/fetch-url/:UID', async (req, res) => {
    const id = req.params.UID

    try {

        if (id) {
            let unique_data = await file_model.find({ unique_code: id })

            res.status(200).send({
                unique_data
            })
        }

    } catch (error) {
        console.log(error)

        res.status(404).send({
            message: "Can't Receive Data"
        })
    }
})

// ================================================= GET API END =======================================================




// ================================================= DELETE API START =======================================================

const deleteApi = async (delete_id) => {

    await userModel.deleteOne({
        user_id: delete_id
    })
}
// ================================================= DELETE API END =======================================================



// ================================================= SOCKET IO START ==============================================
io.on('connection', async (socket) => {

    mongoDB()
    
    socket.emit("justForMe", socket.id)

    socket.on("disconnect", () => {
        deleteApi(socket.id)
    })
})

// ================================================= SOCKET IO END ==============================================


server.listen(process.env.PORT_NO, () => {
    console.log("Server Start at port 4000");

})

