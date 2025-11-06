"use client";
import { useState } from "react";
import preguntasData from "../assets/QuestionsDB.json";
import PreguntaCard from "@/components/preguntaCard";
import ProgresoPreguntas from "@/components/progresoPreguntas";
import NavegacionPreguntas from "@/components/navegacionPreguntas";

export default function Examen() {
    const preguntas = preguntasData.preguntas.filter(p => Object.keys(p).length > 0);
    const preguntasPorPagina = 2;
    const totalPaginas = Math.ceil(preguntas.length / preguntasPorPagina);
    const [paginaActual, setPaginaActual] = useState(1);

    const inicio = (paginaActual - 1) * preguntasPorPagina;
    const fin = inicio + preguntasPorPagina;
    const preguntasVisibles = preguntas.slice(inicio, fin);

    return (
        <div className="flex flex-col items-center p-6 bg-blue-100">
        {preguntasVisibles.map((pregunta) => (
            <PreguntaCard key={pregunta.id} pregunta={pregunta} />
        ))}

        <ProgresoPreguntas
            totalPaginas={totalPaginas}
            paginaActual={paginaActual}
            onChangePagina={setPaginaActual}
        />

        <NavegacionPreguntas
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onAnterior={() => setPaginaActual(paginaActual - 1)}
            onSiguiente={() => setPaginaActual(paginaActual + 1)}
        />
        </div>
    );
}
