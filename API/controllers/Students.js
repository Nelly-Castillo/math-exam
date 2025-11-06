const db = require('../config/db');

exports.getStudents = (req, res) => {
    const query = `SELECT * FROM students`;
    
    db.query(query, (error, rows) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
        res.status(200).json({ students: rows });
    });
};

exports.createStudent = (req, res) => {
    const { exp, name, group, career, grade, teacherId } = req.body;

    if (!exp || !name || !group || !career) {
        return res.status(400).json({ message: "El expediente, nombre, grupo y carrera son requeridos" });
    }

    const query = `INSERT INTO students (exp, name, grupo, career, grade, teacher_ID) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [exp, name, group, career, grade, teacherId], (error, result) => {
        if (error) {
            console.error("Error al crear al alumno: ", error);
            if (error.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "El alumno ya existe" });
            }
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (result.affectedRows === 1) {
            return res.status(201).json({
                student: { exp, name, group, career, grade, teacherId }
            });
        } else {
            return res.status(500).json({ message: "No se pudo crear al estudiante." });
        }
    });
};

exports.getStudent = (req, res) => {
    const exp = req.params.exp;
    const query = `SELECT exp, name, grupo, career, grade, teacher_ID FROM students WHERE exp = ?`;

    db.query(query, [exp], (error, rows) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }
        res.status(200).json({ student: rows[0] });
    });
};

exports.updateStudent = (req, res) => {
    const exp = req.params.exp;
    const { name, group, career, grade, teacherId } = req.body;

    const query = `UPDATE students SET name = ?, grupo = ?, career = ?, grade = ?, teacher_ID = ? WHERE exp = ?`;
    const queryParams = [name, group, career, grade, teacherId, exp];

    db.query(query, queryParams, (error, result) => {
        if (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(403).json({ message: "Operación prohibida." });
            }
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        res.status(200).json({ student: { exp, name, group, career, grade, teacherId } });
    });
};

exports.patchStudent = (req, res) => {
    const exp = req.params.exp;
    const { name, group, career, grade, teacherId } = req.body;

    const query = `UPDATE students SET 
        name = COALESCE(?, name), 
        grupo = COALESCE(?, grupo), 
        career = COALESCE(?, career), 
        grade = CASE WHEN ? IS NULL THEN NULL ELSE COALESCE(?, grade) END, 
        teacher_ID = CASE WHEN ? IS NULL THEN NULL ELSE COALESCE(?, teacher_ID) END 
        WHERE exp = ?`;
    const queryParams = [name, group, career, grade, grade, teacherId, teacherId, exp];

    db.query(query, queryParams, (error, result) => {
        if (error) {
            if (error.code === 'ER_ROW_IS_REFERENCED_2') {
                return res.status(403).json({ message: "Operación prohibida." });
            }
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        res.status(200).json({ message: "Estudiante actualizado correctamente" });
    });
};

exports.deleteStudent = (req, res) => {
    const exp = req.params.exp;
    const query = `DELETE FROM students WHERE exp = ?`;
    
    db.query(query, [exp], (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado." });
        }
        res.status(204).send();
    });
};

exports.getStudentQuestions = (req, res) => {
    const exp = req.params.exp;
    const rolesWithAnswers = ['TEACHER', 'ADMIN'];

    const query = `
        SELECT sq.question_id, sq.text AS question_text, sq.level, sq.grade, a.id AS answer_id, a.text AS answer_text, a.is_correct
        from (	
		    SELECT eq.question_id, q.text, q.level, q.grade
		    FROM student_questions eq
		    INNER JOIN questions q ON q.id = eq.question_id
		    WHERE eq.student_exp = ?)  sq
        INNER JOIN answers a ON  sq.question_id = a.question_id`
    ;

    db.query(query, [exp], (error, rows) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "Preguntas no encontradas" });
        }

        const questions = rows.reduce((acc, row) => {
            let question = acc.find(q => q.id === row.question_id);
            if (!question) {
                question = {
                    id: row.question_id,
                    text: row.question_text,
                    level: row.level,
                    grade: row.grade,
                    answers: []
                };
                acc.push(question);
            }

            if (row.answer_id) {
                const answer = {
                    id: row.answer_id,
                    text: row.answer_text
                };

                if (rolesWithAnswers.includes(req.user?.role)) {
                    answer.isCorrect = Boolean(row.is_correct);
                }
                question.answers.push(answer);
            }

            return acc;
        }, []);

        res.status(200).json({ studentExp: Number(exp), questions });
    });
};

exports.addStudentQuestions = (req, res) => {
    const exp = req.params.exp;
    const { questionIds } = req.body;

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {
        return res.status(400).json({ message: "Se requiere los IDs de preguntas" });
    }

    const query = `
        INSERT INTO student_questions (student_exp, question_id) 
        VALUES ${questionIds.map(() => '(?, ?)').join(', ')}`;

    const queryParams = questionIds.flatMap(id => [exp, id]);

    db.query(query, queryParams, (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }

        res.status(201).json({ studentExp: Number(exp), questionIds });
    });
};

exports.getStudentQuestion = async (req, res) => {
    const role = req.user?.role;
    const { exp, id } = req.params;

    try {
        const questionQuery = 
            `SELECT q.id, q.text, q.level, q.grade FROM student_questions AS s_q
            JOIN questions AS q ON s_q.question_id = q.id 
            WHERE s_q.student_exp = ? AND q.id = ?;`;
    
        const questionResults = await db.query(questionQuery, [ exp, id ]);

        if (questionResults.length == 0) {
            return res.status(404).json({ message: 'No se encontró la pregunta' });
        }

        const question = questionResults[0];

        const answerQuery = `SELECT a.id, a.text, a.is_correct FROM answers AS a WHERE question_id = ?`;
        const answerResults = await db.query(answerQuery, [ id ]);
        const answers = answerResults.map(asw => {
            return {
                id: asw.id,
                text: asw.text,
                isCorrect: role == 'STUDENTS' ? undefined : Boolean(asw.is_correct)
            };
        });

        return res.status(200).json({
            studentExp: Number(exp),
            question: {
                ...question,
                answers
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.deleteStudentQuestion = (req, res) => {
    const exp = req.params.exp;
    const id = req.params.id;

    const query = `DELETE FROM student_questions WHERE student_exp = ? AND question_id = ?`;

    db.query(query, [exp, id], (error, result) => {
        if (error) {
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pregunta no encontrada" });
        }

        res.status(204).send();
    });
};

exports.getStudentQuestionAnswer = async (req, res) => {
    const { exp, id } = req.params;

    try {
        const query = `
            SELECT s_a.student_exp, a.question_id, a.id AS answer_id, a.text, a.is_correct
            FROM student_answers as s_a
            JOIN answers AS a ON s_a.answer_id = a.id 
            WHERE s_a.student_exp = ? AND a.question_id = ?;`;
            
        const results = await db.query(query, [ exp, id ]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Respuesta no encontrada" });
        }

        const result = results[0];
            
        return res.status(200).json({
            studentExp: result.student_exp,
            questionId: result.question_id,
            answer: {
                id: result.answer_id,
                text: result.text,
                isCorrect: Boolean(result.is_correct)
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.addStudentQuestionAnswer = async (req, res) => {
    const { exp, id } = req.params;
    const { answerId } = req.body;

    if (typeof answerId != 'number') {
        return res.status(400).json({ message: "El ID de respuesta no es válido" });
    }

    try {
        // Check if question is assigned to student
        const questionQuery = 'SELECT * FROM student_questions WHERE student_exp = ? AND question_id = ?;';
        const questionResults = await db.query(questionQuery, [ exp, id ]);

        if (questionResults.length == 0) {
            return res.status(404).json({ message: 'La pregunta no está asignada al estudiante' });
        }

        // Check if answer belongs to question
        const answerQuery = 'SELECT a.id, a.text FROM answers AS a WHERE id = ? AND question_id = ?;';
        const answerResults = await db.query(answerQuery, [ answerId, id ]);

        if (answerResults.length == 0) {
            return res.status(400).json({ message: 'La respuesta no pertenece a la pregunta especificada' });
        }

        const answer = answerResults[0];

        // Check if question has already been answered
        const existingAnswersQuery = 
        `SELECT s_a.student_exp, a.question_id FROM student_answers AS s_a 
        JOIN answers AS a ON s_a.answer_id = a.id
        WHERE s_a.student_exp = ? AND a.question_id = ?;`;
        const existingAnswersResults = await db.query(existingAnswersQuery, [exp, id ]);

        if (existingAnswersResults.length > 0) {
            return res.status(400).json({ message: 'La pregunta ya ha sido respondida' });
        }

        // Insert answer
        const insertQuery = 'INSERT INTO student_answers (student_exp, answer_id) VALUES(?, ?);';
        const insertResults = await db.query(insertQuery, [ exp, answerId ]);

        return res.status(201).json({
            studentExp: Number(exp),
            questionId: Number(id),
            answer: {
                id: answer.id,
                text: answer.text
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }

};