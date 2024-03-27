const express = require('express');
const multer = require('multer');
const fs = require('node:fs');
const path = require('path');
const {create} = require('express-handlebars');

const app = express();

const hbs = create({
    extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el directorio' });
        }
        // Renderizar la vista 'home' y pasar los archivos como contexto
        res.render('home', { files });
    });
});


const upload = multer({ 
    dest: 'uploads/',
    fileFilter: function (req, file, cb) {
        // Verificar si el archivo es una imagen
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true); // Aceptar archivo
        } else {
            cb(new Error('El archivo no es una imagen, vuelve a intentarlo. Formatos válidos(.jpg, .jpeg, .png)')); // Rechazar archivo
        }
    }
});

/*
app.post('/images/single', upload.single('imagenFiesta'), (req, res)=> {
    console.log(req.file);
    saveImage(req.file);
    res.redirect('/uploadExitoso.html');
});*/


app.post('/images/multi', upload.array('photos', 10), (req, res)=>{
    try{
        req.files.map(saveImage);
    res.send(`
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <link rel="stylesheet" href="./style.css">
                <title>Galeria 15 de Nahiara</title>
                <meta http-equiv="refresh" content="3;url=/">
                <style>
                    @font-face {
                        font-family: 'Rosela';
                        src: url('/font/rosela_4/Rosela.ttf') format('truetype');
                    }
                </style>
                <style>
                body {
                    text-align: center;
                    background-image: url('/img/fondo.webp');
                    font-family: 'Rosela', sans-serif;
                    font-size: 20px;
                    width:100%;
                    padding: 20px
                };
                img{
                    margin-left: auto;
                    margin-right: auto;
                    width: auto
                }
            </style>
            </head>
            <body style="text-align: center; background-image: url(/img/fondo.webp); font-family: 'Rosela'
            }">
                <div class="container-fluid text-center py-5 px-0 mx-0 d-flex justify-content-center align-items-center flex-column" style="height: 100%">
                    <p style="padding: 0; margin: 0">Las fotos se subieron correctamente!</p>
                    <img class="img img-fluid" src="/img/doneGif.gif" style="padding-top: 0; margin-top: 0">
                </div>
            </body>
        </html>`);
    }
    catch(error) {
        res.send(`
        <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <link rel="stylesheet" href="./style.css">
                <title>Galeria 15 de Nahiara</title>
                <meta http-equiv="refresh" content="3;url=/">
                <style>
                    @font-face {
                        font-family: 'Rosela';
                        src: url('/font/rosela_4/Rosela.ttf') format('truetype');
                    }
                </style>
                <style>
                body {
                    text-align: center;
                    background-image: url('/img/fondo.webp');
                    font-family: 'Rosela', sans-serif;
                    font-size: 20px;
                    width:100%;
                    padding: 20px
                };
                img{
                    margin-left: auto;
                    margin-right: auto;
                    width: auto
                }
            </style>
            </head>
            <body style="text-align: center; background-image: url(/img/fondo.webp); font-family: 'Rosela'
            }">
                <div class="container-fluid text-center py-5 px-0 mx-0 d-flex justify-content-center align-items-center flex-column" style="height: 100%">
                    <p style="padding: 0; margin: 0">Hubo un error, por favor, vuelve a intentarlo</p>
                    <img class="img img-fluid" src="/img/errorGif.gif" style="padding-top: 0; margin-top: 0">
                </div>
            </body>
        </html>`);
    }
    
});

function saveImage(file){
    const newPath = `./uploads/${file.originalname}`;
    fs.renameSync(file.path, newPath);
    return newPath;
}

app.listen(3000, ()=> {
    console.log('Servidor escuchando en el puerto 3000');
})