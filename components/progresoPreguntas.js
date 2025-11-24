export default function ProgresoPreguntas({ totalPaginas, paginaActual, onChangePagina }) {
    return (
        <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
            key={num}
            onClick={() => onChangePagina(num)}
            className={`w-8 h-8 rounded-full text-white ${
                num === paginaActual
                ? "bg-[#4169e1] "
                : "bg-[#8aa0e0]"
            }`}
            >
            {num}
            </button>
        ))}
        </div>
    );
}
