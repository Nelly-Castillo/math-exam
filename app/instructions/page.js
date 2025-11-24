"use client";

import NavBar from "@/components/header";
import { useRouter } from "next/navigation";

export default function Instructions() {
    const router = useRouter();

    return (
        <div className="w-full h-full">
            <NavBar/>
            <div className="flex flex-col items-center justify-center pt-60  p-8">
                <div className="bg-white  text-gray-800 p-8 rounded-xl shadow-md max-w-lg">
                    <h1 className="text-xl font-bold mb-4">Bienvenido, alumn@</h1>
                    <ol className="list-decimal pl-5 space-y-2">
                    <li>Solo tienes una oportunidad para responder el examen.</li>
                    <li>No podrás levantarte de tu lugar una vez iniciado.</li>
                    <li>Presiona el botón de finalizar al terminar.</li>
                    <li>Podrás usar tu hoja de cálculo.</li>
                    <li>Evita hacer ruido.</li>
                    </ol>
                    <button
                    onClick={() => router.push("/exam")}
                    className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                    Iniciar examen
                    </button>
                </div>
            </div>
        </div>
    );
}
