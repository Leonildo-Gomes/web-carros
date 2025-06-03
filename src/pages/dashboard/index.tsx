import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { deleteObject, ref } from 'firebase/storage';
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from 'react-icons/fi';
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";
import { AuthContext } from "../../context/AuthContext";
import { db, storage } from "../../services/firebaseConnection";
import { CarProps } from '../home';
export function Dashboard() { 
    const [cars, setCars] = useState<CarProps[]>([]); 
    const [loadImages, setLoadImages ] = useState<string[]>([]); 
    const { user } = useContext(AuthContext); 

    useEffect(()=> {  
         async function getCars() {
            if(!user?.uid){
                return; 
            } 
            const carsRef = collection(db, "cars"); 
            const querryRef= query(carsRef,where("uid", "==", user?.uid)); 
            getDocs(querryRef )
            .then( (snapshot)=> {
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
            .catch ((error)=>{ 
                console.log(error) 
            }) 

        }
        getCars(); 
    },[user])

    function handleImageLoad(id: string): void {
        setLoadImages((prevState) => [...prevState, id]); 
    }

    async function handleDeleteCar(car: CarProps) {
        const docRef = doc(db, "cars", car.id);
        await deleteDoc(docRef)
        .then(() => {
            toast.success("Carro para deletado com sucesso")  
            car.images.map( async (image) => {
                const imageRef = ref(storage, `images/${image.uid}/${image.name}`);
                try {
                    await deleteObject(imageRef); 
                } catch (error) {
                    toast.error('Erro ao deletar imagens')
                    console.log(error)
                } 
            }) 
            setCars ((cars.filter((carItem) => carItem.id !== car.id)));
        })
        
        .catch((error) => {
            console.log(error) 
            toast.error('Erro ao deletar o carro') 
        }) ; 
         
    }

    return ( 
        <Container> 
            <DashboardHeader/>
            <main className="grid grid-cols-1 gap-6 md-grid-cols-2 lg:grid-cols-3 ">
                 { cars.map((car)=>(
                     <section className="w-full bg-white rounded-lg relative" key={car.id}>
                        <button className='absolute  bg-white w-10 h-10 rounded-full flex items-center justify-center top-2 right-2  drop-shadow'
                            onClick={() => { handleDeleteCar(car )} }
                        >
                            <FiTrash2 size={20} color='#000'/>
                        </button>
                        <div className="w-full rounded-lg h-72 bg-slate-200"
                            style={{ display: loadImages.includes(car.id) ? 'none' : 'block' }}
                            >
                        </div>
                        <img className="w-full rounded-lg mb-2 max-h-70"
                            src={car?.images[0].url} 
                            alt= {car.images[0].name} 
                            onLoad={ ()=>handleImageLoad(car.id)}
                            style={{ display: loadImages.includes(car.id) ? 'block' : 'none' }}
                        /> 
                        <p className="font-bold mt-1 mb-2">{car.name}</p>
                        <div className="flex flex-col px-2">
                            <span className="text-zinc-700 mb-6"> 
                                Ano {car.year} | {car.km} km
                            </span>
                            <strong className="text-black font-bold text-xl">
                            { Number(car.price).toLocaleString('pt-br', {
                                style: 'currency',
                                currency: 'BRL'
                            })}
                            </strong>
                        </div>
                        <div className=" w-full h-px bg-slate-200 my-2"></div>
                        <div className=" px-2 pb-2">
                            <span className="text-zinc-700 mb-6">{car.city}</span>
                        </div>
 
                    </section>
                 )) }
               

            </main>
        </Container>
    )
} 