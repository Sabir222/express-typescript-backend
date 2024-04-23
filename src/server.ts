import express, { Application, Request, Response, NextFunction } from "express";


const app:Application = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})