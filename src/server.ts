import express, { Application, Request, Response, NextFunction } from "express";


const app:Application = express();

const PORT = process.env.PORT || 5000;


app.get('/',(req:Request,res:Response)=>{
     res.status(200).send('Hello World ')
})

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})