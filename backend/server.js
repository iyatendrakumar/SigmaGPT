import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
const app = express();
const PORT= process.env.PORT || 8080;

app.use(express.json());

app.use(cors({
  origin: [
    "https://sigma-gpt-lilac.vercel.app"
  ],
  methods: ["GET", "POST", "DELETE", "PUT"]
}));


app.use("/api", chatRoutes);
// app.listen(PORT, ()=>{
//     console.log(`server running on ${PORT}`);
//     connectDB();
// });

// const connectDB = async() =>{
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log("Connected with Database!");
//     } catch(error){
//         console.log("Failed to connect to DB", error);
//     }
// };
// Connect DB first, then start server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to connect to DB", error);
  }
};

startServer();


app.post("/test", async (req, res)=>{
    
    const options = {
        method : "POST",
        headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
                role:"user",
                content: req.body.message
            }]
        })
    };
    try{
       const response = await fetch("https://api.openai.com/v1/chat/completions", options);
       const data=await response.json();
       //console.log(data.choices[0].message.content);
       res.send(data.choices[0].message.content);
    } catch(err){
        console.log(err);
    }
});