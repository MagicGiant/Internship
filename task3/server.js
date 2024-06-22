const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const app = express();


const staticPath = path.resolve(__dirname, 'static');

app.set('view engine', 'ejs');
app.use(express.static('css'));

const createViewPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`);

renderPath = async (res, fileDirPath) =>{
    fs.stat(fileDirPath, (err, stats) =>{
        if (err){
            return res.status(404).send('File or directory not found');
        }

        if (stats.isFile()){
            res.sendFile(fileDirPath);
        }
        else{
            fs.readdir(fileDirPath, (err, files) => {
                if (err){
                    console.error('Error reading static directory', err);
                    return res.status(500).send('Server error');
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
    const fileDirPath = path.join(staticPath, req.params[0]);

    renderPath(res, fileDirPath);
});

app.use((req, res) => {
    let redirectPath = '/';
    console.log(`Invalid link. Redirect to "${redirectPath}"`);
    res.redirect(redirectPath);
});