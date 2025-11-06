export default function SubpreguntaItem({ sub }) {
    return (
        <div className="mb-2">
        <p className="text-sm font-medium text-black">{sub.texto}</p>
        {sub.opciones ? (
            <ul className="list-disc pl-5 mt-1">
            {sub.opciones.map((op, i) => (
                <li key={i}>{op}</li>
            ))}
            </ul>
        ) : (
            <input
            type="text"
            placeholder="Tu respuesta"
            className="border rounded-md p-1 mt-1 w-full bg-transparent border-gray-500"
            />
        )}
        </div>
    );
}
