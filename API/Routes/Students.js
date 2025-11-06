const express = require("express");
const controller = require('../controllers/Students');

const router = express.Router();

router.get('/students', controller.getStudents);
router.post('/students', controller.createStudent);

router.get('/student/:exp', controller.getStudent);
router.put('/student/:exp', controller.updateStudent);
router.patch('/student/:exp', controller.patchStudent);
router.delete('/student/:exp', controller.deleteStudent);

router.get('/student/:exp/questions', controller.getStudentQuestions);
router.post('/student/:exp/questions', controller.addStudentQuestions);

router.get('/student/:exp/question/:id', controller.getStudentQuestion);
router.delete('/student/:exp/question/:id', controller.deleteStudentQuestion);

router.get('/student/:exp/question/:id/answer', controller.getStudentQuestionAnswer);
router.post('/student/:exp/question/:id/answer', controller.addStudentQuestionAnswer);

module.exports = router;