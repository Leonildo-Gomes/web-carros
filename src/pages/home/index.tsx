import { Container } from "../../components/container";


export function Home() { 
    return ( 
        <Container > 
           <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
             <input className="w-full border-2 rounded-lg h-9 px-3 outline-none" 
              placeholder="Digite o nome do carro..."
            />
            <button className="bg-red-500 text-white h-9 px-8 rounded-lg font-medium text-lg">
                Buscar
            </button>
           </section>

           <h1 className="font-bold text-2xl mt-6 text-center mb-4">
                 Carros novos e usados em todo o Brazil
           </h1>
           <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <section className="w-full rounded-lg bg-white" >
                    <img className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 trassition-all"
                        src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202504/20250424/bmw-320i-2.0-16v-turbo-flex-m-sport-automatico-wmimagem10213290971.jpg?s=fill&w=1920&h=1440&q=75" alt="carro" 
                    />
                    <p className="font-bold mt-1 mb-2 px-2">BMW 320i</p>
                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700 mb-6"> 
                            Ano/2018  -- 23.000km
                        </span>
                        <strong className="text-black font-medium text-xl">
                            R$ 190.000
                        </strong>
                    </div>
                    <div className=" w-full h-px bg-slate-200 my-2"></div>
                    <div className=" px-2 pb-2">
                        <span className="text-zinc-700 mb-6">
                            Campo Grande
                        </span>
                    </div>
                </section>
                
           </main>
        </Container>
    )
} 