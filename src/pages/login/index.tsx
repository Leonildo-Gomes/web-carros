import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import logo from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
const schema =z.object( { 
    email: z.string().email("Digite um email válido").nonempty("O campo Email é obrigatorio"),
    password: z.string().nonempty("O campo de password é obrigatório")
 }  )
type FormData= z.infer<typeof schema>
export function Login() { 
    const  { register, handleSubmit, formState:  {errors }}= useForm<FormData>( { 
            resolver:zodResolver(schema),
            mode:'onChange'
        }
    )
    function onSubmit(data: FormData){
        console.log(data)
    } 
   
    return ( 
        <Container> 
           <div className='bg-amber-500 w-full min-h-screen flex justify-center items-center flex-col gap-4' >
                <Link to="/" className='mb-6 max-w-sm w-full'>
                    <img 
                        src={ logo }  
                        alt="Logo do site" 
                        className='w-full'
                    />
                </Link>
                <form 
                    className='bg-white max-w-xl'
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

                     <button>Acessar</button>
                           
                </form>
           </div>

        </Container>
    )
} 