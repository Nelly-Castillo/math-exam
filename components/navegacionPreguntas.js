export default function NavegacionPreguntas({ paginaActual, totalPaginas, onAnterior, onSiguiente }) {
    return (
        <div className="flex gap-4 mt-6">
        {paginaActual > 1 && (
            <button
            onClick={onAnterior}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
            Anterior
            </button>
        )}

        {paginaActual < totalPaginas && (
            <button
            onClick={onSiguiente}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
            Siguiente
            </button>
        )}
        </div>
    );
}
