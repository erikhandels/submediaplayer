import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

import fs from 'fs';
const fileName = './public/config.json';
import file from './public/config.json' assert {type: 'json'};

let data = {}
Object.assign(data, file)

// console.log(data)

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    open('http://localhost:3000', { wait: false, fullscreen: true});
});

app.post('/update', (req, res) => {
    // Object.keys(req.body).forEach((key, value) => console.log(req.body[key].style))
    Object.keys(req.body).forEach(key => Object.assign(data[key].button.style, req.body[key].style))
    fs.writeFile(fileName, JSON.stringify(data), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing to ' + fileName);
      });
    res.send({"status": "saved"})
})