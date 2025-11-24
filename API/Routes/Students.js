const express = require("express");
const { verificarToken, verificarRol } =  require("../middleware/auth");
const controller = require('../controllers/Students');
const router = express.Router();

// router.post('/student/save', controller.saveAnswers);
router.get("/students", (req, res) => {
    res.send("OK STUDENTS");
});

router.post(
    "/student/save",
    verificarToken,
    verificarRol("student"),
    controller.saveAnswers
);

module.exports = router;