import NavBar from "@/components/header";

export default function Login() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient   bg-[#0E3A66]  text-white">
        <NavBar/>
        <div className="flex-1 flex items-center justify-center">
            <div className="bg-white text-black rounded-xl shadow-xl p-8 w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">¡Bienvenido!</h2>
            <p className="mb-6">Ingresa tus credenciales</p>

            <form className="space-y-4">
                <div className="text-left">
                <label className="block text-sm font-medium mb-1">
                    Expediente / No. de trabajador:
                </label>
                <input
                    type="text"
                    placeholder="Ingresa tu expediente"
                    className="border w-full px-3 py-2 rounded-md bg-transparent border-gray-500"
                />
                </div>

                <div className="text-left">
                <label className="block text-sm font-medium mb-1">
                    Contraseña:
                </label>
                <input
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    className=" border w-full px-3 py-2 rounded-md bg-transparent border-gray-500"
                />
                </div>

                <button
                type="submit"
                className="w-full bg-[#0E1A47] text-white rounded-lg py-2 mt-4 hover:bg-[#1C2C7D] transition"
                >
                Continuar
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}
