import express from "express";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === "production") job.start();

//middleware
app.use(express.json());

app.listen(PORT, ()=>{
console.log("App running on: ",PORT)
})
