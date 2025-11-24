const express = require("express");
const router = express.Router();
const initDB = require("../config/db.js");
// import { Router } from "express";

// const router = Router();

router.get("/auth/check/:record", async (req, res) => {
    const { record } = req.params;

    try {
        const db = await initDB();
        const [rows] = await db.query(
            "SELECT * FROM teachers WHERE record = ?",
            [record]
        );

        if (rows.length > 0) {
            return res.json(
                { 
                    tipo: "teacher", 
                    message: "Teacher"
                }
            );
        } else {
            return res.json(
                { 
                    tipo: "student", 
                    message: "Student"
                }
            );
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
