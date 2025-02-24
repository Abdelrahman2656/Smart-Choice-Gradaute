import { dbconnection } from "./Database/dbconnection"
import { AppRequest, AppResponse } from "./Src/Utils/type"
import path from 'path'
import cors from 'cors';
import dotenv from 'dotenv'
const express = require('express')
const app = express()
const port = 3000
dotenv.config({ path: path.resolve("./config/.env") });
app.use(cors({
    origin: '*', 
  }));
//db
dbconnection()
app.get('/', (req:AppRequest, res:AppResponse) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))