require('dotenv').config();
const express = require('express');
const index = require('./middleware/index');
const cors = require('./middleware/cors');
const notFound = require('./middleware/notFound');
// const admins = require('./Routes/Admins');
// const questions = require('./Routes/Questions');
// const students = require('./Routes/Students');
// const teachers = require('./Routes/Teachers');

const bodyParser = require("body-parser");


// const examRoutes = require("./routes/examRoutes");
const app = express();

console.log("Hola")
app.use(cors);
app.use(bodyParser.json());

app.get('/', index);

// App.use(admins);
// App.use(questions);
// App.use(students);
// App.use(teachers);

app.use(notFound);
const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});