export default function NavegacionPreguntas({ paginaActual, totalPaginas, onAnterior, onSiguiente }) {
    return (
        <div className="flex gap-4 mt-6 text-white">
        {paginaActual > 1 && (
            <button
            onClick={onAnterior}
            className="px-4 py-2 bg-[#5e78c4] rounded-lg"
            >
            Anterior
            </button>
        )}

        {paginaActual < totalPaginas && (
            <button
            onClick={onSiguiente}
            className="px-4 py-2 bg-blue-600 rounded-lg"
            >
            Siguiente
            </button>
        )}
        </div>
    );
}
