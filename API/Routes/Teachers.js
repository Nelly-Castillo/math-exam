const express = require("express");
const controller = require('../controllers/Teachers');

const router = express.Router();

router.get('/teachers', controller.getData);

router.post('/teachers', controller.createData);

router.get('/teacher/:workerId', controller.getTeacher);

router.put('/teacher/:workerId', controller.updateData);

router.delete('/teacher/:workerId', controller.deleteTeacher);

router.get('/teacher/:workerId/students', controller.getTeacherStudents);

router.post('/teacher/:workerId/students', controller.addStudentToTeacher);

router.get('/teacher/:workerId/student/:exp', controller.getTeacherStudentByExp);

router.delete('/teacher/:workerId/student/:exp', controller.removeStudentFromTeacher);

module.exports = router;