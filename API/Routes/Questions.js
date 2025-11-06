const express = require('express');
const router = express.Router();

const controller = require('../controllers/Questions.js');
const pathQuestions = "/questions";
const pathSingleQuestion = "/question";


router.get(
    `${pathQuestions}`,
    controller.getQuestions
);

router.post(
    `${pathQuestions}`,
    controller.createQuestion
);

router.get(
    `${pathSingleQuestion}/:id(\\d+)`,
    controller.getQuestion
);

router.put(
    `${pathSingleQuestion}/:id(\\d+)`,
    controller.updateQuestion

);

router.patch(
    `${pathSingleQuestion}/:id(\\d+)`,
    controller.patchQuestion
);

router.delete(
    `${pathSingleQuestion}/:id(\\d+)`,
    controller.deleteQuestion
);

router.get(
    `${pathSingleQuestion}/:id(\\d+)/answers`,
    controller.getAnswersForQuestion
);

router.post(
    `${pathSingleQuestion}/:id(\\d+)/answers`,
    controller.createAnswersForQuestion
);

router.get(
    `${pathSingleQuestion}/:questionId(\\d+)/answer/:answerId(\\d+)`,
    controller.getAnswerForQuestion
);

router.put(
    `${pathSingleQuestion}/:questionId(\\d+)/answer/:answerId(\\d+)`,
    controller.updateAnswerForQuestion
);

router.patch(
    `${pathSingleQuestion}/:questionId(\\d+)/answer/:answerId(\\d+)`,
    controller.patchAnswerForQuestion
);

router.delete(
    `${pathSingleQuestion}/:questionId(\\d+)/answer/:answerId(\\d+)`,
    controller.deleteAnswerForQuestion
);

module.exports = router;