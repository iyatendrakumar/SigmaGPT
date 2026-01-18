import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";

const app = express();
const PORT= process.env.PORT || 8080;


app.use(cors({
  origin: [
    "https://sigma-gpt-lilac.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials:true
}));

app.use(express.json());

//Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

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

//DB + SERVER
connectDB();

app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
  });