import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import logo from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
import { auth } from '../../services/firebaseConnection';

const schema =z.object( { 
    email: z.string().email("Digite um email válido").nonempty("O campo Email é obrigatorio"),
    password: z.string().nonempty("O campo de password é obrigatório")
 }  )
type FormData= z.infer<typeof schema>
export function Login() { 

    const navigate = useNavigate(); 
    const  { register, handleSubmit, formState:  {errors }}= useForm<FormData>( { 
            resolver:zodResolver(schema),
            mode:'onChange'
        }
    )

    useEffect(() => {
        async function handleLogout() {
            await signOut(auth); 
        }
        handleLogout(); 
    }, []) 
    function onSubmit(data: FormData){
       signInWithEmailAndPassword(auth, data.email, data.password) 
       .then((user) => {
            console.log(user) 
            
            toast.success("Usuario Logado com sucesso") 
            navigate("/dashboard", { replace: true }) 
       })
       .catch((error) => {
           console.log("erro ao fazer o login no Sistema")  
           toast.error("erro ao fazer o login no Sistema") 
           console.log(error) 
       })
    } 
   
    return ( 
        <Container> 
           <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4' >
                <Link to="/" className='mb-6 max-w-sm w-full'>
                    <img 
                        src={ logo }  
                        alt="Logo do site" 
                        className='w-full'
                    />
                </Link>
                <form 
                    className='bg-white max-w-xl w-full rounded-lg p-4'
                    onSubmit={handleSubmit(onSubmit)}>
                     <div className='mb-3'>
                        <Input type="email"
                            placeholder="Digite o seu email"
                            name="email"
                            error={ errors.email?.message}
                            register = { register} 
                        />
                     </div>
                     <div className='mb-3'>
                        <Input type="password"
                            placeholder="Digite o seu password"
                            name="password"
                            error={ errors.password?.message}
                            register = { register} 
                        />
                     </div>

                     <button type='submit' className='bg-zinc-900 w-full rounded-md h-10 text-white font-medium cursor-pointer'>
                        Acessar
                    </button>
                           
                </form>
                <Link to='/register'>
                    Ainda nao possui uma conta? Cadastre-se
                </Link>
           </div>

        </Container>
    )
} 