require('dotenv').config();
const express = require('express');

const initDB = require("./config/db");

const index = require('./middleware/index');
const cors = require('./middleware/cors');
const notFound = require('./middleware/notFound');
// const admins = require('./Routes/Admins');
// const questions = require('./Routes/Questions');
const students = require('./Routes/Students');
const teachers = require('./Routes/Teachers');
const auth = require("./Routes/Auth");
const authRoutes = require("./Routes/Auth");




const bodyParser = require("body-parser");
const app = express();

initDB()
    .then(conn => conn.query("SELECT 1"))
    .then(() => console.log("BD conectada con éxito"))
    .catch(err => console.log("Error BD:", err));


// connection.query("SELECT 1")
//     .then(() => console.log("BD conectada con éxito"))
//     .catch(err => console.log("Error BD:", err));
// const examRoutes = require("./routes/examRoutes");
console.log("Iniciando servidor...");
app.use(cors);
app.use(bodyParser.json());

// app.get('/', index);
app.use("/", authRoutes);
// App.use(admins);
// App.use(questions);
app.use(students);
app.use(teachers);
app.use(auth);
app.use(notFound);
const PORT = process.env.PORT || 4000;
console.log("PORT desde env:", process.env.PORT);

app.listen(PORT, ()=>{
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});