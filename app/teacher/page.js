import NavBar from "@/components/header";


export default function DashboardTeacher() {
    const grupos = ["Grupo 31", "Grupo 32", "Grupo 33"];

    return (
        <div className="min-h-screen flex flex-col bg-[#7DA0B9] text-black">
        <NavBar/>
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-[#BFD4DE] p-8 rounded-2xl shadow-xl w-[500px]">
            <div className="mb-6">
                <p className="font-medium">Bienvenido, profesor</p>
                <h2 className="font-medium">Resultados disponibles para descargar</h2>
            </div>

            <div className="divide-y divide-gray-400">
                {grupos.map((grupo, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center py-3"
                >
                    <p>{grupo}</p>
                    <button className="bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600 transition">
                    Descargar
                    </button>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    );
}
