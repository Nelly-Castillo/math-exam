const db = require('../config/db');

exports.getData = (req, res) => {
  const query = `SELECT worker_ID as workerId, name FROM teachers`;
  db.query(query, (error, rows) => {
    if (error) {
      console.error('Error obteniendo los datos del maestro:', error);
      return res.status(500).json({ code: 500, message: "Error al obtener la información." });
    }
    return res.status(200).json({ teachers: rows });
  });
};

exports.createData = (req, res) => {
  const { workerId, name } = req.body;

  if (!workerId || !name) {
    return res.status(400).json({ message: "El expediente del profesor y el nombre son requeridos" });
  }

  if (typeof workerId !== "number") {
    return res.status(400).json({ message: "El expediente del profesor debe ser un número" });
  }

  const query = `INSERT INTO teachers (worker_ID, name) VALUES (?, ?)`;

  db.query(query, [workerId, name], (error, result) => {
    if (error) {
      console.error("Error al crear profesor:", error);
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "El profesor ya existe" });
      }
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    if (result.affectedRows === 1) {
      return res.status(201).json({ teacher: { workerId: workerId, name: name } });
    } else {
      return res.status(500).json({ message: "No se pudo crear el profesor." });
    }
  });
};

exports.getTeacher = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const query = `SELECT worker_ID as workerId, name FROM teachers WHERE worker_ID = ?`;
  db.query(query, [workerId], (error, rows) => {
    if (error) {
      console.error('Error obteniendo los datos del maestro:', error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    return res.status(200).json({ teacher: rows[0] });
  });
};

exports.updateData = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "El nombre es requerido" });
  }
  const query = `UPDATE teachers SET name = ? WHERE worker_ID = ?`;
  db.query(query, [name, workerId], (error, result) => {
    if (error) {
      console.error('Error actualizando al maestro teacher:', error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    return res.status(200).json({ teacher: { workerId: workerId, name: name } });
  });
};

exports.deleteTeacher = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const query = `DELETE FROM teachers WHERE worker_ID = ?`;
  db.query(query, [workerId], (error, result) => {
    if (error) {
      console.error('Error eliminando al maestro:', error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Profesor no encontrado" });
    }
    res.status(204).send();
  });
};

exports.getTeacherStudents = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const query = `
    SELECT s.exp, s.name, s.grupo, s.career, s.grade 
    FROM students s
    JOIN teachers t ON s.teacher_ID = t.worker_ID
    WHERE t.worker_ID = ?
  `;
  db.query(query, [workerId], (error, rows) => {
    if (error) {
      console.error('Error obteniendo datos el estudiante del maestro:', error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Profesor no encontrado o sin estudiantes" });
    }
    res.status(200).json({ workerId: workerId, students: rows });
  });
};

exports.addStudentToTeacher = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const { exp } = req.body;
  
  if (!exp) {
    return res.status(400).json({ message: "El expediente del estudiante es requerido" });
  }

  const query = `UPDATE students SET teacher_id = ? WHERE exp = ?;`
    
  db.query(query, [workerId, exp], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    return res.status(201).json({ workerId: workerId, student: { exp: exp } });
  });
};

exports.getTeacherStudentByExp = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const exp = parseInt(req.params.exp);
  const query = `
    SELECT s.exp, s.name, s.grupo, s.career, s.grade 
    FROM students s
    JOIN teachers t ON s.teacher_ID = t.worker_ID
    WHERE t.worker_ID = ? AND s.exp = ?
  `;
  db.query(query, [workerId, exp], (error, rows) => {
    if (error) {
      console.error('Error fetching al estudiante en especifo:', error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Estudiante no encontrado para este profesor" });
    }
    res.status(200).json({ workerId: workerId, student: rows[0] });
  });
};

exports.removeStudentFromTeacher = (req, res) => {
  const workerId = parseInt(req.params.workerId);
  const exp = parseInt(req.params.exp);
  const query = `UPDATE students SET teacher_id = NULL WHERE teacher_id = ? AND exp = ?`;
  db.query(query, [workerId, exp], (error, result) => {
    if (error) {
      console.error('Error eliminando el estudiante del maestro:', error);
      return res.status(500).json({ message: "Error interno del servidor" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Relación profesor-estudiante no encontrada" });
    }
    res.status(204).send();
  });
};