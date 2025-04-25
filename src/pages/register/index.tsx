import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import logo from '../../assets/logo.svg';
import { Container } from '../../components/container';
import { Input } from '../../components/input';
const schema =z.object( { 
    name:z.string().nonempty("O campo é obrigatorio") ,
    email: z.string().email("Digite um email válido").nonempty("O campo Email é obrigatorio"),
    password: z.string().min(6, "A password deve ter pelo menos 6 caracteres").nonempty("O campo de password é obrigatório")
 }  )
type FormData= z.infer<typeof schema>
export function Register() { 
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
                        <Input type="text"
                            placeholder="Digite o seu nome..."
                            name="name"
                            error={ errors.name?.message}
                            register = { register} 
                        />
                     </div>

                     <div className='mb-3'>
                        <Input type="email"
                            placeholder="Digite o seu email..."
                            name="email"
                            error={ errors.email?.message}
                            register = { register} 
                        />
                     </div>

                     <div className='mb-3'>
                        <Input type="password"
                            placeholder="Digite o seu password..."
                            name="password"
                            error={ errors.password?.message}
                            register = { register} 
                        />
                     </div>

                     <button type='submit' className='bg-zinc-900 w-full rounded-md h-10 text-white font-medium'>
                        Cadastrar
                    </button>
                           
                </form>

                <Link to='/login'>
                    Já possui uma conta? faca o login!
                </Link>
           </div>

        </Container>
    )
} 