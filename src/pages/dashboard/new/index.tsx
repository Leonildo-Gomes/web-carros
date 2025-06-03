import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";

import { addDoc, collection } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FiTrash, FiUpload } from 'react-icons/fi';
import { v4 as uuidV4 } from 'uuid';
import { z } from 'zod';
import { Input } from "../../../components/input";
import { AuthContext } from "../../../context/AuthContext";
import { db, storage } from "../../../services/firebaseConnection";



const schema =z.object( {
     name:z.string().nonempty("O campo é obrigatorio"), 
     model:z.string().nonempty("O campo é obrigatorio") ,
     year:z.string().nonempty("O campo é obrigatorio"), 
     km:z.string().nonempty("O campo é obrigatorio") ,
     price:z.string().nonempty("O campo é obrigatorio"),
     description:z.string().nonempty("O campo é obrigatorio") ,
     city:z.string().nonempty("O campo é obrigatorio"),
     whatsapp:z.string().min(1,"O campo é obrigatorio").refine((value)=>/^(\d{10,11})$/.test(value),{
        message: "Numero invalido" 
     })  
})
type FormData = z.infer<typeof schema> 

interface ImageItemProps {
     uid: string; 
     name: string;
     previewUrl: string; 
     url: string; 
}
export function New() { 
    const { user }= useContext(AuthContext); 
    const { register, handleSubmit, formState:  {errors }, reset}= useForm<FormData>( {
            resolver:zodResolver(schema),
            mode:'onChange'
        })
    const [carImages, setCarImages ] =useState<ImageItemProps[]> ([]); 
    function onSubmit(data: FormData){
        console.log(carImages.length ) 
        if(carImages.length === 0) {
            alert("Envie pelo menos uma imagem");
            return ;
        }
        const carListImages = carImages.map((item) => {
            return {
                uid: item.uid, 
                name: item.name,
                url: item.url
            }
        })
        addDoc(collection(db, "cars"), {
            name: data.name,
            model: data.model,
            year: data.year,
            km: data.km,
            price: data.price,
            description: data.description,
            city: data.city,
            whatsapp: data.whatsapp,
            created: new Date(),
            uid: user?.uid,
            owner:user?.name,
            images: carListImages
        })
        .then(() => {
             console.log("cadastrado com sucesso")
             reset()
             setCarImages([]) 
        })
        .catch((error) => {
            console.log(error)
            console.log("erro ao cadastrar") 
        })
        console.log(data)
    } 
    async function handleFile(event: ChangeEvent<HTMLInputElement>){
        if(event.target.files && event.target.files[0]) { 
            const image = event.target.files[0] 
            if(image.type !== 'image/png' && image.type !== 'image/jpeg') {
                return alert('Tipo de arquivo invalido');
            }
            console.log(image)
            await handleUpload(image) 
            //gruardar ficheiro na BD
        } 
    }
    async function handleUpload(image: File) {
        if (!user?.uid) {
            return alert("Usuário não logado");
        }
    
        const currentUid = user.uid;
        console.log(currentUid); 
        const uidImage = uuidV4();
        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
        const uploadTask = uploadBytesResumable(uploadRef, image);
    
        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
            },
            (error) => {
                console.error("Erro no upload:", error.code, error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    console.log("Download URL:", url);
                    const imageItem = {
                        uid: currentUid,
                        name: uidImage,
                        previewUrl: URL.createObjectURL(image),
                        url: url, 
                    }
                    setCarImages((carImages)=> [...carImages, imageItem]); 
                });
            }
        );
    }
    async function handleDeleteImage(item: ImageItemProps){
       const imagePath=`images/${user?.uid}/${item.name}`; 
       const imageRef=ref(storage, imagePath); 
       try {
            await deleteObject(imageRef); 
            setCarImages((carImages) => carImages.filter((carImage) => carImage.uid !== item.uid)); 
       } catch (error) {
            console.log(error)
       } 
    }

   /* async function handleUpload(image: File) {
       
        if(!user?.uid){
            return alert("Usuario nao logado")
        } 
        const currentUid=user?.uid;
        const uidImage=uuidV4(); 
        const uploadRef=ref(storage,`images/${currentUid}/${uidImage}`);
        console.log("upload");
        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref)
            .then((urlImage) => {
                console.log(urlImage)
            }).catch((e)=>{
                console.log(e) 
            })
        })
        .catch((e)=>{
            console.log(e)
        });
        console.log("upload 33");
    } */

    return ( 
        <Container> 
            <DashboardHeader/>

            <div className="w-full bg-white  p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">

                <button className="border-2 w-48 h-32 rounded-lg flex items-center justify-center">
                    <div className="absolute cursor-pointer"> 
                        <FiUpload size={30} color='#000'/> 
                    </div>
                    <div className=" cursor-pointer">
                        <input 
                            type="file"  
                            accept="image/*" 
                            className="opacity-0 cursor-pointer" 
                            onChange={handleFile}
                        />
                    </div>
                </button>

                {carImages.map ( item => (
                    <div key={item.uid} className="w-full h-32 flex items-center justify-center relative" > 
                        <button className="absolute top-2 right-2  cursor-pointer" onClick={()=>handleDeleteImage(item ) }>
                            <FiTrash size={28} color='#ff0000' /> 
                        </button>
                        <img
                            src={item.previewUrl }
                            alt="foto do carro"
                            className=" h-32 object-cover rounded-lg w-full" 

                        />
                    </div>
                )
                     
                )}
            </div>
            <div  className="w-full bg-white  p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">

                <form  onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <div className="mb-3">
                        <p className="mb-2 font-medium"> Nome do Carro</p>
                        <Input
                            type="text"
                            register={ register } 
                            name="name"     
                            error={ errors.name?.message } 
                            placeholder=" Ex: Chevrolet... " 
                        />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium"> Modelo do Carro</p>
                        <Input
                            type="text"
                            register={ register } 
                            name="model"     
                            error={ errors.model?.message } 
                            placeholder=" Ex: Cruze..." 
                        />
                    </div>
                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full " >
                            <p className="mb-2 font-medium"> Ano</p>
                            <Input
                                type="text"
                                register={ register } 
                                name="year"     
                                error={ errors.year?.message } 
                                placeholder=" Ex: 2018..." 
                            />
                        </div>

                        <div className="w-full ">
                            <p className="mb-2 font-medium"> KM percorridos</p>
                            <Input
                                type="text"
                                register={ register } 
                                name="km"     
                                error={ errors.km?.message } 
                                placeholder=" Ex: 32.000 Km..." 
                            />
                        </div>
                    </div>
                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full " >
                            <p className="mb-2 font-medium"> Telefone/Whatsapp </p>
                            <Input
                                type="text"
                                register={ register } 
                                name="whatsapp"     
                                error={ errors.whatsapp?.message } 
                                placeholder=" Ex: 023456706..." 
                            />
                        </div>

                        <div className="w-full ">
                            <p className="mb-2 font-medium"> Cidade</p>
                            <Input
                                type="text"
                                register={ register } 
                                name="city"     
                                error={ errors.city?.message } 
                                placeholder=" Ex: Oslo..." 
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preco</p>
                        <Input
                            type="text"
                            register={ register } 
                            name="price"     
                            error={ errors.price?.message } 
                            placeholder=" Ex: 69.000... " 
                        />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium"> Descricao</p>
                        <textarea className="border-1 w-full rounded-md h-24 px-2"
                            { ...register("description") }
                            name="description" 
                            placeholder="Digite a descrição do carro..." 
                            id="description"  
                        />
                         {errors.description && <p className='my-1 text-red-500'> {errors.description?.message }</p>
                        } 
                    </div>
                    <button className="w-full bg-zinc-900 font-medium text-white py-2 rounded-md hover:bg-blue-500 transition-colors mt-4 h-10" 
                        type="submit"
                        >
                            Cadastrar
                    </button> 
                </form>
            </div>
        </Container>
    )
} 
