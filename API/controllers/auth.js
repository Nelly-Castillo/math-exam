import jwt from "jsonwebtoken";
import db from "../db.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar el usuario
        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE email = ?", 
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];

        // 2. Comparamos contraseña DIRECTA (SIN bcrypt)
        if (password !== user.password) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // 3. Crear token con el rol del usuario
        const token = jwt.sign(
            {
                id: user.id,
                rol: user.rol,
            },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );

        res.json({
            message: "Login correcto",
            token,
            rol: user.rol
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el login" });
    }
};
