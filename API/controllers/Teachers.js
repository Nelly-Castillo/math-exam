const initDB = require('../config/db');
const fs = require("fs"); 
const path = require("path");

const downloadResults = async (req, res) => {
    try {
        const [rows] = await initDB.query("SELECT * FROM answer");

        let csvData = "id,id_student, answer\n";

        rows.forEach(r => {
            csvData += `${r.id},${r.id_student},"${r.answer_json}"\n`;
        });

        const filePath = path.join("uploads", "resultados.csv");

        fs.writeFileSync(filePath, csvData);

        res.download(filePath);

    } catch (error) {
        console.error(error);
        res.status(500).json(
          { 
            message: "Error al generar archivo" 
          }
        );
    }
};

module.exports = {
    downloadResults
};