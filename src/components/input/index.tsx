import { RegisterOptions, UseFormRegister } from 'react-hook-form';
interface InputProps  { 
    type:string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions
    
 }
export function Input({ name, type, placeholder , register, rules, error}: InputProps) { 

    return (
        <div>
            <input className="w-full border-1 rounded-md h-11 px-2 outline-none"
               placeholder={  placeholder }
              type={  type } 
              id={ name }
              { ...register(name, rules) }
            />
            { error && <p className='my-1 text-red-500'>{ error }</p>
             }

        </div>
    )
 }