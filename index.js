const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const { connection } = require("./Configue/db");
const { UserModel } = require("./Models/user.model");
const {notesRouter}=require("./Routes/notes.route");
const { authenticate } = require("./middleware/Authentication");

const app = express();

app.use(express.json())
app.use(cors({
    origin : "*"
}))

app.get("/", (req, res) => {
    res.send("Welcome")
})

app.post("/signup", async (req, res) => {
    //const payload=req.body;
    console.log(req.body,"signUP req body")
    const { email, password, name, age } = req.body;
    const userPresent=await UserModel.findOne({email});
    if(userPresent?.email){
        res.send("Try logging in, already user exist");
    }
    else{
        try {
            bcrypt.hash(password, 5, async function (err, hash) { // async is requied in this call back function because of await used below
                // Store hash in your password DB.
                console.log(hash, "hash generted in singUP");
                const user = new UserModel({ email, password: hash}) // in MOdel password is the key name so  u can't directly use hash ; so"password:hash" (is being used)
                await user.save() // make call back function also async
                res.send({"msg":"signup successfull"})
            });
    
        } catch (error) {
            console.log(error);
            res.send({"err":"something went wrong in sign up post request"})
        }
    }
    

})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // const user = await UserModel.find({ email, password });  // password from user will be in plain text and in db in hashed form; so just use email to find user
        const user = await UserModel.find({ email })
        console.log(user)


        if (user.length > 0) {
            const hashed_password = user[0].password;
            bcrypt.compare(password, hashed_password, function (err, result) {
                if (result) {
                    // const token = jwt.sign({ "course": 'nxm' }, 'hush'); will add user_id into token
                    const token=jwt.sign({"userID":user[0]._id},'hush');
                    return res.send({ "msg": "Login successfull", "token": token })
                }else{
                    return res.send({"err":"login failed"});
                }
            });
            
        } else {
            return res.send({"err":"login failed"});
        }
    } catch (error) {
        res.send("error")
    }
    
})


app.get("/about", (req, res) => {
    res.send("About us data")
})
app.use(authenticate)
app.use("/notes",notesRouter)


app.listen(8080, async () => {
    try {
        await connection;
        console.log("Connected to DB successfuly")
    } catch (error) {
        console.log(error);
        console.log("failed to Connect DB")
    }
    console.log("listening on PORT 8080")
})

// app.get("/weather", (req, res) => {
//     // if(req.query.token ==="abc765"){
//     //     res.send("Weather data of city xyz")  // to get this use url like this http://localhost:8080/weather?token=abc765 not /weather?abc765
//     // }else{
//     //     res.send("Please login to access this endpoint")
//     // }
//     //var token=req.query.token;
//     //  const token=req.headers.authorization;// if you are not using Bearer in headers (as a convention)
//     const token = req.headers.authorization?.split(" ")[1];
//     var decoded = jwt.verify(token, 'hush', (err, decoded) => {
//         if (err) {
//             res.send("Please login again")
//         } else if (decoded) {
//             res.send("weather data...")
//         }
//     });

// })

// app.get("/purchased", (req, res) => {
//     var token = req.query.token;
//     var decoded = jwt.verify(token, 'hush', (err, decoded) => {
//         // if(err){
//         //     res.send(err);
//         // }else{
//         //     console.log(decoded,"decoded"); // o/p is { course: 'nxm', iat: 1670770964 } decoded
//         // }
//         if (err) {
//             res.send("Please login again")
//         } else if (decoded) {
//             res.send("purchased data...")
//         }
//     });
//     //console.log(decoded,"decoded") // if you enter wrong token ; o/p will show jwt must be provided

// })


// app.get("/contact", (req, res) => {
//     res.send("contact data")
// })

// app.listen(8080, async () => {
//     try {
//         await connection;
//         console.log("Connected to DB successfuly")
//     } catch (error) {
//         console.log(error);
//         console.log("failed to Connect DB")
//     }
//     console.log("listening on PORT 8080")
// })