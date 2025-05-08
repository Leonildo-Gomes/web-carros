import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
export function DashboardHeader() { 
    async function handleLogout(): Promise<void> {
        await signOut(auth);
    }

    return (
        <div className='w-full flex items-center  h-10 bg-red-500  mb-4 px-4 gap-4  text-white rounded-lg font-medium'>
                <Link to='/dashboard'>
                    Dashboard
                </Link>
                <Link to='/dashboard/new' >
                    Cadastrar Carro
                </Link>
                <button  onClick={handleLogout} className="ml-auto">
                    Sai da conta
                </button>
        </div> 
    )

 }