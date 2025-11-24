const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Token requerido" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ message: "Token inválido" });
    }
};

const verificarRol = (rol) => {
    return (req, res, next) => {
        if (req.user.rol !== rol) {
            return res.status(403).json({ message: "No tienes permisos" });
        }
        next();
    };
};

module.exports = {
    verificarToken,
    verificarRol
};