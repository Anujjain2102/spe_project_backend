import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

// mongoose.connect("mongodb://127.0.0.1:27017/speproject", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => {
//     console.log("DB connected")
// })

mongoose.connect("mongodb://localhost:27017/speproject",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection is successful");
}).catch((e)=>{
    console.log(e);
    // console.log("No Connection");
});


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    role: String,
    password: String
})
const User = new mongoose.model("User", userSchema)


//Routes
app.post("/login",async (req,res)=> {
    const { email, password} = req.body
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        if(existingUser.password === password) {
            res.send({message: "Login Successfull", user: existingUser})
        } else {
            res.send({message: "Password didn't match"})
        }
    } else {
        res.send({message: "User doesn't exist"})
    }
})


// Define an API endpoint to retrieve user information by email address
app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    try {
      const user = await User.findOne({ email });
      res.send({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post("/register",async (req,res)=> {
   
    const {name, email, mobile, role, password} = req.body

    const existingUser = await User.findOne({ email });
    
    if(existingUser) {
        console.log("User already registered!!");
        res.send({message: "User already registered!!"})
    } else {
        console.log("User not registered!!");
        const user = new User({
            name,
            email,
            mobile,
            role,
            password
        })
        try {
            const savedUser = await user.save();
            res.json({ message: 'User registered successfully' });
          } catch (err) {
            console.error(err);
            res.json({ message: 'Failed to register user' });
          }
        
    }
})


app.listen(9002,()=>{
    console.log("Backend started at port 9002")
})