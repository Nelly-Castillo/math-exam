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

router.get("/teacher/:id/groups", async (req, res) => {
    const { id } = req.params;

    try {
        const db = await initDB();

        const [groups] = await db.query(
            `SELECT g.id_group, g.group_name
                FROM groups g
                JOIN teacher_groups tg ON g.id_group = tg.id_group
                WHERE tg.id_teacher = ?`,
            [id]
        );

        res.json(groups);

    } catch (err) {
        console.error("Error obteniendo grupos del maestro:", err);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.get(
    "/teacher/download",
    verificarToken,
    verificarRol("teacher"),
    controller.downloadResults
);

module.exports = router;