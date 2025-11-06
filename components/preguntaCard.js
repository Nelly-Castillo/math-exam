import SubpreguntaItem from "./subpreguntaItem";

export default function PreguntaCard({ pregunta }) {
    return (
        <div className="mb-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md text-black">
        <h2 className="font-semibold mb-3">
            {pregunta["indicación:"] || pregunta.enunciado}
        </h2>

        {/* Subpreguntas o pregunta de opción múltiple */}
        {pregunta.subpreguntas ? (
            <div>
            {pregunta.subpreguntas.map((sub) => (
                <SubpreguntaItem key={sub.id} sub={sub} />
            ))}
            </div>
        ) : pregunta.opciones ? (
            <ul className="list-disc pl-5">
            {pregunta.opciones.map((op, i) => (
                <li key={i}>{op}</li>
            ))}
            </ul>
        ) : (
            <p>No hay subpreguntas u opciones.</p>
        )}
        </div>
    );
}
