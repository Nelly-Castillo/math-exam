"use client";

import NavBar from "@/components/header";
import { useRouter } from "next/router";

export default function Instructions() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-10">
            <NavBar/>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-lg">
                <h1 className="text-xl font-bold mb-4">Bienvenido, alumn@</h1>
                <p className="font-semibold mb-2">Instrucciones:</p>
                <ol className="list-decimal pl-6 space-y-2">
                <li>Solo tienes una oportunidad para responder el examen.</li>
                <li>Una vez iniciado el examen no podrás levantarte de tu lugar.</li>
                <li>Al finalizar, presiona el botón de finalizar.</li>
                <li>Podrás hacer tus cálculos en la hoja proporcionada.</li>
                <li>Procura no hacer demasiado ruido.</li>
                </ol>
                <button
                onClick={() => router.push("/exam")}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                Iniciar examen
                </button>
            </div>
        </div>
    );
}
