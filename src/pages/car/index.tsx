import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Container } from "../../components/container";
import { db } from "../../services/firebaseConnection";
  interface CarProps {
    id: string;
    name?: string;
    model: string; 
    description: string; 
    year: string;
    km: string;
    price: string | number; 
    city: string;
    uid: string;
    owner : string;
    created: string;
    whatsapp: string; 
    images: CarImageProps[] 
}
interface CarImageProps {
    uid: string; 
    name: string; 
    url: string 
}
export function CarDetail() { 
    const [car, setCar] = useState<CarProps>(); 
    const {id} = useParams(); 
    const [sliderPerview , setSliderPerview ] = useState<number>(2); 
    const navigate=useNavigate();

    useEffect(()=> {
        async function getCar() {
            if(!id){return; } 
            const docRef = doc(db, "cars", id); 
            getDoc(docRef)
            .then((snapshot) => {
                console.log(snapshot.data())
                if(!snapshot.exists()) {
                    navigate("/"); 
                    return
                } 
                setCar({ 
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    description: snapshot.data()?.description,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    price: snapshot.data()?.price,
                    city: snapshot.data()?.city,
                    uid: snapshot.data()?.uid,
                    owner: snapshot.data()?.owner,
                    created: snapshot.data()?.created,
                    whatsapp: snapshot.data()?.whatsapp,
                    images: snapshot.data()?.images 
                }); 
                
            })
        } 
        getCar(); 
         
    }, []); 
    useEffect (() => {
        function handleRezise() {
             if(window.innerWidth < 720) {
                setSliderPerview(1); 
             } else {
                setSliderPerview(2); 
             }
        } 
        
        handleRezise(); 
        window.addEventListener('resize', handleRezise); 
        return () => {
            window.removeEventListener('resize', handleRezise); 
        } 
        
    }, []) 
    return ( 
       <Container >
            { car && (
                 <Swiper slidesPerView={sliderPerview} 
                    pagination={{clickable: true}} 
                    navigation
                    modules={[Navigation, Pagination]}
                >
                    {car?.images.map(image =>(
                        <SwiperSlide key={image.name}> 
                            <img className='w-full h-96 object-cover' 
                            src={image.url} alt="" 
                            /> 
                        </SwiperSlide> 
                    ))} 
                </Swiper>   
            ) }
            { car && (
                <main className='w-full bg-white rounded-lg p-6 my-4'>
                    <div className='flex flex-col sm:flex-row mb-4 items-center justify-between '>
                        <h1 className='font-bold text-3xl text-black'>{car?.name}</h1> 
                        <h1 className='font-bold text-3xl text-black'>{Number(car?.price).toLocaleString('pt-br', {
                                style: 'currency',
                                currency: 'BRL'
                            })}</h1> 
                    </div>
                    <p>{car?.model} </p>
                    <div className='flex w-full gap-6 my-4 '>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <p>Cidade</p>
                                <strong> {car?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{car?.year}</strong>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div>
                                <p>Km</p>
                                <strong> {car?.km}</strong>
                            </div>
                           
                        </div>
                    </div>
                    <strong>Descricao</strong>
                    <p className='mb-4 '>{car?.description} </p>
                    <strong> Telefone/ WatsApp</strong>
                    <p>{car?.whatsapp} </p>


                    <a  className=' w-full bg-green-500 text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium  cursor-pointer'
                        href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text= Ola vie esse carro ${car?.name} no site WebCarros e fiquei interessado!`}  
                        target='_blank' 
                    >
                        Conversar com o Vendedor
                        <FaWhatsapp size={24} color='#FFF'/> 
                    </a>
                    
                </main>
            ) }
       </Container> 
    )
} 