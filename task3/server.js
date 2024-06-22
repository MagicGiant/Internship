const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const app = express();


const staticPath = path.resolve(__dirname, 'static');

app.set('view engine', 'ejs');
app.use(express.static('css'));

const createViewPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);

renderPath = (res, filePath) =>{
    
    fs.stat(filePath, (err, stats) =>{
        if (stats.isFile()){
            res.sendFile(filePath);
        }
        else{
            fs.readdir(filePath, (err, files) => {
                if (err){
                    console.error('Error reading static directory', err);
                    res.status(500).send('Server error');
                }
                else
                    res.render(createViewPath('index'), {files});
            });
        }
    })
} 

app.listen(PORT, err => {
    err ? console.log(err) : console.log(`http://localhost:${PORT}/`)
});

app.get('/', (req, res) => {
    renderPath(res, staticPath);
});

app.get('/*', (req, res) => {
    const filePath = path.join(staticPath, req.params[0]);

    renderPath(res, filePath);
});

app.use((req, res) => {
    let redirectPath = '/';
    console.log(`Invalid link. Redirect to "${redirectPath}"`);
    res.redirect(redirectPath);
});