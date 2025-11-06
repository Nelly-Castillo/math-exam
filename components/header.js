import Image from 'next/image'

export default function NavBar() { 
    return (
        <nav className=" bg-[#0E3A66] relative flex items-center justify-between px-2 py-3 bg-OxfordBlue shadow-lg w-full">
        <div className="container flex items-center">
            <div className="flex items-center justify-start w-full">
            <div className="w-30 h-12 flex items-center justify-start mr-4">
                <Image
                src="/images/logoUAQ.png"
                width={250}
                height={250}
                alt="Logo"
                />
            </div>
            <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white backdrop-blur-md">
                Evalución diagnóstica de matemáticas
            </a>
            </div>
        </div>
        </nav>
    );
}