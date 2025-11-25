"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/header";

export default function DashboardTeacher() {
    const [profName, setProfName] = useState("");
    const [grupos, setGrupos] = useState([]);
    useEffect(() => {
        const name = localStorage.getItem("profName");
        const id = localStorage.getItem("idTeacher");

        if (name) setProfName(name);

        console.log("ID del profesor:", id);

        if (!id) return;

        getGroups(id);
    }, []);
    const getGroups = async (id) => {
        console.log("Pidiendo grupos del maestro con id:", id);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/teacher/${id}/groups`);

            const data = await res.json();
            console.log("Respuesta de grupos:", data);

            setGrupos(data); // guardamos los grupos
        } catch (error) {
            console.error("Error obteniendo grupos:", error);
        }

    };
    const router = useRouter();
    const handleLogout = () => {
        // 1. Eliminar el token del almacenamiento local
        localStorage.removeItem("teacherToken"); 
        // 2. Opcional: Limpiar cualquier otro dato de la sesión, como el nombre
        localStorage.removeItem("teacherName"); 
        // 3. Redirigir al login
        router.push("/login");
    };
    return (
        <div className="min-h-screen flex flex-col  text-black">
        <NavBar/>
        <div className="flex pt-5 p-5 justify-end">
            <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                    Cerrar Sesión
                </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[500px]">
            <div className="mb-6">
                <p className="text-xl font-semibold">Bienvenido, {profName || "Profesor"}</p>
                <h2 className="font-medium">Resultados disponibles para descargar</h2>
            </div>

            <div className="divide-y divide-gray-400">
                {grupos.length === 0 ? (
                        <p>No tienes grupos asignados.</p>
                    ) : (
                        grupos.map((grupo) => (
                            <div
                                key={grupo.id_group}
                                className="flex justify-between items-center py-3"
                            >
                                <span className="text-lg">{grupo.group_name}</span>
                                <a
                                    href={`/teacher/download?idGroup=${grupo.id_group}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl"
                                >
                                    Descargar archivo
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        </div>
    );
}
