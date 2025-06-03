import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "../../components/container";
import { db } from "../../services/firebaseConnection";

 export interface CarProps {
    id: string;
    name: string;
    year: string;
    km: string;
    price: string | number; 
    city: string;
    uid: string;
    images: CarImageProps[] 
}
interface CarImageProps {
     uid: string; 
     name: string; 
     url: string 
}
export function Home() { 

    const [cars, setCars] = useState<CarProps[]>([]); 
    const [loadImages, setLoadImages ] = useState<string[]>([]); 

    useEffect(() => {
        async function getCars() {
            const carsRef = collection(db, "cars"); 
            const querryRef= query(carsRef, orderBy("created", "desc")); 
            getDocs(querryRef)
            .then((snapshot) => {
                console.log(snapshot.docs)
                const list = [] as CarProps[]; 
                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        price: doc.data().price,
                        city: doc.data().city,
                        uid: doc.data().uid,
                        images: doc.data().images
                    })
                })
                setCars(list); 
                 
            })
            .catch((error) => {
                console.log(error) 
            }) 
        }
        getCars(); 
    }, []) 

    function handleImageLoad(id: string): void {
        setLoadImages((prevState) => [...prevState, id]); 
    }

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
           { cars.map(car => (
            <Link key={car.id} to={`/car/${car.id}`}>
                <section className="w-full rounded-lg bg-white">
                    
                    <div className="w-full rounded-lg h-72 bg-slate-200"
                        style={{ display: loadImages.includes(car.id) ? 'none' : 'block' }}>

                    </div>
                    <img className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 trassition-all"
                        src={ car.images[0].url} 
                        alt={ car.images[0].name} 
                        onLoad={ () => handleImageLoad(car.id)}
                        style={{ display: loadImages.includes(car.id) ? 'block' : 'none' }}
                    />
                    <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>
                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700 mb-6"> 
                            Ano { car.year} | { car.km}km
                        </span>
                        <strong className="text-black font-medium text-xl">
                        { Number(car.price).toLocaleString('pt-br', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                        </strong>
                    </div>
                    <div className=" w-full h-px bg-slate-200 my-2"></div>
                    <div className=" px-2 pb-2">
                        <span className="text-zinc-700 mb-6">
                        { car.city}
                        </span>
                    </div>
                    </section>
            </Link>     
           ))}         
           </main>
        </Container>
    )
} 