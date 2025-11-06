const db = require('../config/db.js');

const serverErrorMessage = { message: "Error en el servidor" };
const questionNotFoundMessage = { message: "Pregunta no encontrada" };
const questionBadRequestMessage = { message: "El texto, nivel y calificación deben ser válidos" };
const answerNotFoundMessage = { message: "Respuesta no encontrada" };
const answerBadRequestMessage = { message: "Proporcione respuestas válidas" };


exports.getQuestions = async (req, res) => {
    const query = `SELECT * FROM Questions`;

    try {
        const result = await db.query(query);
        res.status(200).json({ questions: result });
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
        return;
    }
};


exports.createQuestion = async (req, res) => {
    const { text, level, grade } = req.body;

    if (typeof text != 'string'  || typeof level != 'number' || typeof grade != 'string' ) {
        res.status(400).json(questionBadRequestMessage);
        return;
    }

    try {
        const query = `INSERT INTO Questions (text, level, grade) VALUES (?, ?, ?)`;
        const result = await db.query(query, [text, level, grade]);

        res.status(201).json({ question: { id: result.insertId, text, level, grade } });
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
        return;
    }
};


exports.getQuestion = async (req, res) => {
    const questionId = req.params.id;
    const query = `SELECT * FROM Questions WHERE id = ?`;

    try {
        const result = await db.query(query, [questionId]);
        if (result.length === 0) {
            res.status(404).json(questionNotFoundMessage);
            return;
        }
        res.status(200).json({ question: result[0] });
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
};


exports.updateQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { text, level, grade } = req.body;

    if (typeof text != 'string' || typeof level != 'number' || typeof grade != 'string') {
        res.status(400).json(questionBadRequestMessage);
        return;
    }

    const query = `UPDATE Questions SET text = ?, level = ?, grade = ? WHERE id = ?`;

    try {
        const result = await db.query(query, [text, level, grade, questionId]);

        if (result.affectedRows === 0) {
            res.status(404).json(questionNotFoundMessage);
            return;
        }

        res.status(200).json({ question: { id: Number(questionId), text, level: Number(level), grade } });
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
};


exports.patchQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { text, level, grade } = req.body;

    if (
        (text != undefined && typeof text != 'string')
        || (level != undefined && typeof level != 'number')
        || (grade != undefined && typeof grade != 'string')
    ) {
        res.status(400).json(questionBadRequestMessage);
        return;
    }

    const query = `
        UPDATE Questions 
        SET text = COALESCE(?, text),
        level = COALESCE(?, level),
        grade = COALESCE(?, grade)
        WHERE id = ?
        `
        ;

    try {
        const result = await db.query(query, [text, level, grade, questionId]);
        if (result.affectedRows === 0) {
            res.status(404).json(questionNotFoundMessage);
            return;
        }

        const getQuestionQuery = `SELECT * FROM Questions WHERE id = ?`;
        const [selectResult] = await db.query(getQuestionQuery, [questionId]);
        const responseBody = {
            question: {
                id: selectResult.id,
                text: selectResult.text,
                level: selectResult.level,
                grade: selectResult.grade
            }
        };

        res.status(200).json(responseBody);
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
};


exports.deleteQuestion = async (req, res) => {
    const questionId = req.params.id;
    const query = `DELETE FROM Questions WHERE id = ?`;

    try {
        const result = await db.query(query, [questionId]);
        if (result.affectedRows === 0) {
            res.status(404).json(questionNotFoundMessage);
            return;
        }

        res.status(204).send();
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }

};

exports.getAnswersForQuestion = async (req, res) => {
    const questionId = req.params.id;
    const rolesWithCompleteAnswers = ['ADMIN'];
    try {
        const questionQuery = 'SELECT id FROM questions WHERE id = ?';
        const questionResult = await db.query(questionQuery, [ questionId ]);

        if (questionResult.length == 0) {
            return res.status(404).json(questionNotFoundMessage);
        }
        
        const query = `SELECT * FROM Answers WHERE question_id = ?`;
        const result = await db.query(query, [questionId]);
        const answers = result.map( ({ id, text, is_correct }) => {
            
            let answer = { id, text };
            
            if (rolesWithCompleteAnswers.includes(req.user?.role)) {
                answer.isCorrect = Boolean(is_correct);
            }
            return answer;
        });


        res.json({ questionId: Number(questionId), answers });
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
};


exports.createAnswersForQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { answers } = req.body;

    if (
        !Array.isArray(answers)
        || answers.length === 0
        || !(answers.every(ans => typeof ans.text == 'string' && typeof ans.isCorrect == 'boolean'))
    ) {
        res.status(400).json(answerBadRequestMessage);
        return;
    }

    for (const answer of answers) {
        if (!answer.text || answer.isCorrect === undefined) {
            res.status(400).json(answerBadRequestMessage);
            return;
        }
    }

    const query = `INSERT INTO Answers (question_Id, text, is_correct) VALUES ?`;
    const queryParams = answers.map(answer => [questionId, answer.text, answer.isCorrect]);

    try {
        const result = await db.query(query, [queryParams]);
        const insertedAnswers = answers.map((answer, index) => {
            return {
                id: result.insertId + index,
                text: answer.text,
                isCorrect: answer.isCorrect
            };
        });
        res.status(201).json({ questionId: Number(questionId), answers: insertedAnswers });
    } catch (exception) {
        if (exception.code === 'ER_NO_REFERENCED_ROW_2') {
            res.status(404).json(questionNotFoundMessage);
            return;
        }
        res.status(500).json(serverErrorMessage);
    }
};


exports.getAnswerForQuestion = async (req, res) => {
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    const rolesWithCompleteAnswers = ['ADMIN'];
    try {
        const questionQuery = 'SELECT id FROM Questions WHERE id = ?';
        const questionResult = await db.query(questionQuery, [ questionId ]);

        if (questionResult.length == 0) {
            return res.status(404).json(questionNotFoundMessage);
        }

        const answerQuery = `SELECT * FROM Answers WHERE question_id = ? AND id = ?`;
        const answerResult = await db.query(answerQuery, [questionId, answerId]);
        if (answerResult.length === 0) {
            res.status(404).json(answerNotFoundMessage);
            return;
        }

        let responseBody = {
            questionId: Number(questionId),
            answer: {
                id: Number(answerId),
                text: answerResult[0].text,
            }
        };

        if (rolesWithCompleteAnswers.includes(req.user?.role)) {
            responseBody.answer.isCorrect = Boolean(answerResult[0].is_correct)
        }

        res.status(200).json(responseBody);
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
}


exports.updateAnswerForQuestion = async (req, res) => {
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    const { text, isCorrect } = req.body;

    try {
        if (typeof text != 'string' || typeof isCorrect != 'boolean') {
            return res.status(400).json(answerBadRequestMessage);
        }

        const questionQuery = 'SELECT id FROM Questions WHERE id = ?';
        const questionResult = await db.query(questionQuery, [ questionId ]);

        if (questionResult.length == 0) {
            return res.status(404).json(questionNotFoundMessage);
        }

        const answerQuery = `UPDATE Answers SET text = ?, is_correct = ? WHERE question_id = ? AND id = ?`;
        const answerResult = await db.query(answerQuery, [text, isCorrect, questionId, answerId]);

        if (answerResult.affectedRows === 0) {
            res.status(404).json(answerNotFoundMessage);
            return;
        }

        res.status(200).json({ questionId: Number(questionId), answer: { id: Number(answerId), text, isCorrect } });
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
};


exports.patchAnswerForQuestion = async (req, res) => {
    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    const { text, isCorrect } = req.body;
    
    try {
        if (
            (text != undefined && typeof text != 'string')
            || (isCorrect != undefined && typeof isCorrect != 'boolean')
        ) {
            return res.status(400).json(answerBadRequestMessage);
        }

        const questionQuery = 'SELECT id FROM Questions WHERE id = ?';
        const questionResult = await db.query(questionQuery, [ questionId ]);

        if (questionResult.length == 0) {
            return res.status(404).json(questionNotFoundMessage);
        }

        const query = `
            UPDATE Answers
            SET text = COALESCE(?, text),
            is_correct = COALESCE(?, is_correct)
            WHERE question_id = ? AND id = ?
        `;
        const result = await db.query(query, [text, isCorrect, questionId, answerId]);
        if (result.affectedRows === 0) {
            res.status(404).json(answerNotFoundMessage);
            return;
        }

        const getAnswerQuery = `SELECT * FROM Answers WHERE question_id = ? AND id = ?`;
        const [selectResult] = await db.query(getAnswerQuery, [questionId, answerId]);
        const responseBody = {
            questionId: Number(questionId),
            answer: {
                id: selectResult.id,
                text: selectResult.text,
                isCorrect: Boolean(selectResult.is_correct)
            }
        };
        res.status(200).json(responseBody);
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }

};


exports.deleteAnswerForQuestion = async (req, res) => {

    const questionId = req.params.questionId;
    const answerId = req.params.answerId;
    try {
        const questionQuery = 'SELECT id FROM Questions WHERE id = ?';
        const questionResult = await db.query(questionQuery, [ questionId ]);

        if (questionResult.length == 0) {
            return res.status(404).json(questionNotFoundMessage);
        }

        const deleteQuery = `DELETE FROM Answers WHERE question_id = ? AND id = ?`;
        const deleteResult = await db.query(deleteQuery, [questionId, answerId]);

        if (deleteResult.affectedRows === 0) {
            res.status(404).json(answerNotFoundMessage);
            return;
        }

        res.status(204).send();
    } catch (exception) {
        res.status(500).json(serverErrorMessage);
    }
};