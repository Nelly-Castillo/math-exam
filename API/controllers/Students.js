const initDB = require('../config/db');

const saveAnswers = async (req, res) => {
    try{
        const {id_student, answer } = req.body;
        if(!id_student || !answer){
            return res.status(400).json(
                {
                    message: "Datos imcompletos"
                }
            )
        }
        const connection = await initDB();
        await connection.query(
            "INSERT INTO respuestas (id_student answer_json) VALUES (?, ?)",
            [id_student, JSON.stringify(answer)]
        );
        res.json({ message: "Respuestas guardadas correctamente" });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json(
            { 
                message: "Error al guardar" 
            }
        );
    }
};

module.exports = { 
    saveAnswers
};