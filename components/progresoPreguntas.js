export default function ProgresoPreguntas({ totalPaginas, paginaActual, onChangePagina }) {
    return (
        <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
            key={num}
            onClick={() => onChangePagina(num)}
            className={`w-8 h-8 rounded-full ${
                num === paginaActual
                ? "bg-blue-600 text-white"
                : "bg-gray-400 text-black"
            }`}
            >
            {num}
            </button>
        ))}
        </div>
    );
}
