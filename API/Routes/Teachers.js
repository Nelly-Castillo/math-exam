const { verificarToken, verificarRol } =  require("../middleware/auth");
const express = require("express");
const controller = require('../controllers/Teachers');
const router = express.Router();
const initDB = require("../config/db.js");

// router.get('/teacher/download', controller.downloadResults);
router.get("/teachers", async (req, res) => {
    try {
        const db = await initDB();
        const [rows] = await db.query("SELECT * FROM teachers");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

router.get(
    "/teacher/download",
    verificarToken,
    verificarRol("teacher"),
    controller.downloadResults
);

module.exports = router;