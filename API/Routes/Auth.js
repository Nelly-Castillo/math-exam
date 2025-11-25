const express = require("express");
const router = express.Router();
const initDB = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/auth/check/:record", async (req, res) => {
    const { record } = req.params;
    try {
        const db = await initDB();
        const [teacherRows] = await db.query(
            "SELECT id_teacher, name FROM teachers WHERE record = ?",
            [record]
        );

        if (teacherRows.length > 0) {
            return res.json({ 
                tipo: "teacher", 
                message: "Teacher found"
            });
        } else {
            return res.json(
                { 
                    tipo: "student", 
                    message: "Student record"
                }
            );
        }

    } catch (err) {
        console.error("Error checking record:", err);
        res.status(500).json({ error: "Server error during check." });
    }
});

router.post("/auth/login/teacher", async (req, res) => {
    console.log("BODY RECIBIDO:", req.body);
    const { record , password } = req.body;

    if (!record || !password) {
        return res.status(400).json({ message: "Expediente y contraseña requeridos." });
    }

    try {
        const db = await initDB();
        const [rows] = await db.query(
            "SELECT id_teacher, name, password FROM teachers WHERE record = ?",
            [record]
        );

        const teacher = rows[0];

        if (!teacher) {
            return res.status(401).json({ message: "Expediente o contraseña incorrectos :/." });
        }
        const isMatch = password === teacher.password;
        console.log("teacher.pass:", teacher.password);
        // const isMatch = await bcrypt.compare(password, teacher.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Expediente o contraseña incorrectos." });
        }
        const token = jwt.sign(
            { id: teacher.id_teacher, record: record , rol: 'teacher' },
            process.env.JWT_SECRET || "tu_clave_secreta_aqui", 
            { expiresIn: '1h' }
        );
        
        res.status(200).json({ 
            message: "Login exitoso", 
            token: token,
            name: teacher.name 
        });

    } catch (err) {
        console.error("Error logging in teacher:", err);
        res.status(500).json({ error: "Error en el servidor al iniciar sesión." });
    }
});

module.exports = router;
