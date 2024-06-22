const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const app = express();


const staticPath = path.resolve(__dirname, 'static')
const viewPath = path.resolve(__dirname, 'views')

const createViewPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`); 

app.listen(PORT, err => {
    err ? console.log(err) : console.log(`http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    fs.readdir(staticPath, (err, files) => {
        if (err){
            console.error('Error reading static directory', err);
            res.status(500).send('Server error');
        }
        else{
            res.render(createViewPath('index'), {files});
        }   
    })
})

app.use((req, res) => {
    let redirectPath = '/';
    console.log(`Invalid link. Redirect to "${redirectPath}"`);
    res.redirect(redirectPath);
})