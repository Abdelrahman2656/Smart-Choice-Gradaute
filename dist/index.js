"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnection_1 = require("./Database/dbconnection");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express = require('express');
const app = express();
const port = 3000;
dotenv_1.default.config({ path: path_1.default.resolve("./config/.env") });
app.use((0, cors_1.default)({
    origin: '*',
}));
//db
(0, dbconnection_1.dbconnection)();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
