"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/header";

export default function Login() {
    const [expediente, setExpediente] = useState("");
    // Usaremos 'tipo' para controlar la vista: null | "student" | "teacher"
    const [tipo, setTipo] = useState(null); 
    const [nombreAlumno, setNombreAlumno] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Para mostrar mensajes de error
    const router = useRouter();

    const handleVerificarExpediente = async (e) => {
        e.preventDefault(); // Evita la recarga de la página
        setError(""); // Limpiamos errores anteriores

        if (expediente.trim() === "") {
            setError("Debes ingresar un expediente.");
            return;
        }
        try {
            // Consulta al backend para verificar el expediente
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 
            const res = await fetch(`${apiUrl}/auth/check/${expediente}`, {
                cache: "no-store"
            });
            const data = await res.json();
            if (res.ok) {
                setTipo(data.tipo); 
            } else {
                setError(data.message || "Expediente no encontrado.");
            }
        } catch (error) {
            console.error("Error verificando expediente:", error);
            setError("Error de conexión con el servidor.");
        }
    };
    // Flujo para ALUMNO (Paso 2b)
    const continuarAlumno = () => {
        if (nombreAlumno.trim() === "") {
            setError("Ingresa tu nombre completo para continuar.");
            return;
        }
        localStorage.setItem("studentName", nombreAlumno);
        router.push("/instructions"); 
    };
    // Flujo para PROFESOR (Paso 2a)
    const loginProfesor = async (e) => {
    e.preventDefault();
    setError("");

    if (password.trim() === "") {
        setError("Debes ingresar una contraseña.");
        return;
    }
    // console.log("Enviando login de profesor:");
    // console.log("Expediente enviado:", expediente);
    // console.log("Password enviado:", password);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; 
        const res = await fetch(`${apiUrl}/auth/login/teacher`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ record: expediente.trim(), password: password.trim()}),
            cache: "no-store"
        });

        const data = await res.json();
        // console.log("Respuesta del servidor (status):", res.status);
        // console.log("Respuesta del servidor (data):", data);
        if (res.ok) {
            localStorage.setItem("profName", data.name);
            router.push("/teacher");

        } else {
            setError(data.message || data.error ||"Contraseña incorrecta.");
        }
    } catch (error) {
        console.error("Error de login:", error);
        setError("Error de conexión al intentar iniciar sesión.");
    }
};

    // Función para manejar el cambio en el input de expediente (solo actualiza el estado)
    const handleExpedienteChange = (value) => {
        setExpediente(value);
        if (tipo !== null) setTipo(null); // Resetea la vista si el usuario empieza a escribir de nuevo
        setError("");
    };

    return (
        <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-white text-black rounded-xl shadow-xl p-8 w-80 text-center">
            
            <h2 className="text-xl font-semibold mb-4">¡Bienvenido!</h2>
            
            {error && (
                <p className="text-red-600 mb-4 font-medium">{error}</p>
            )}

            {/* PASO 1: PEDIR EXPEDIENTE */}
            {tipo === null && (
                <form onSubmit={handleVerificarExpediente} className="space-y-4">
                    <div className="text-left">
                        <label className="block text-sm font-medium mb-1">
                        Expediente:
                        </label>
                        <input
                        type="text"
                        value={expediente}
                        onChange={(e) => handleExpedienteChange(e.target.value)}
                        placeholder="Ingresa tu expediente"
                        className="border w-full px-3 py-2 rounded-md bg-transparent border-gray-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#0E1A47] text-white rounded-lg py-2 mt-4 hover:bg-[#1C2C7D] transition"
                    >
                        Continuar
                    </button>
                </form>
            )}

            {/* PASO 2b: ALUMNO → PIDE SU NOMBRE y va a instrucciones */}
            {tipo === "student" && (
                <div className="space-y-4">
                    <p className="font-medium">Hola, Alumno. Ingresa tu nombre para comenzar:</p>

                    <input
                        type="text"
                        value={nombreAlumno}
                        onChange={(e) => setNombreAlumno(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="border w-full px-3 py-2 rounded-md bg-transparent border-gray-500"
                    />
                    <button
                        onClick={continuarAlumno}
                        className="w-full bg-[#5e78c4] text-white rounded-lg py-2 mt-4 hover:bg-[#495f9f] transition"
                    >
                        Ir a instrucciones
                    </button>
                    <button onClick={() => setTipo(null)} className="w-full bg-[#414f78] hover:bg-[#7081b2]  rounded-lg py-2 text-sm text-white  mt-2">
                        Cambiar expediente
                    </button>
                </div>
            )}

            {/* PASO 2a: PROFESOR → PIDE CONTRASEÑA */}
            {tipo === "teacher" && (
                <form onSubmit={loginProfesor} className="space-y-4">
                    <p className="font-medium">Hola, Profesor. Ingresa tu contraseña:</p>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="border w-full px-3 py-2 rounded-md bg-transparent border-gray-500"
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#5e78c4] text-white rounded-lg py-2 mt-4 hover:bg-[#495f9f] transition"
                    >
                        Entrar
                    </button>
                    <button type="button" onClick={() => setTipo(null)} className="w-full bg-[#414f78] hover:bg-[#7081b2]  rounded-lg py-2 text-sm text-white  mt-2">
                        Cambiar expediente
                    </button>
                </form>
            )}
            </div>
        </div>
        </div>
    );
}