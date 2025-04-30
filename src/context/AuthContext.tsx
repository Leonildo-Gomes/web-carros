
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from '../services/firebaseConnection';
interface AuthProviderProps {
    children: ReactNode;
}
interface AuthContextData {
    signed:boolean;
    loadingAuth:boolean 
}
interface UserProps {
    uis:string; 
    name:string  |  null;
    email:string |  null; 
}
export const  AuthContext = createContext({} as AuthContextData); 


export function AuthProvider({ children }:  AuthProviderProps) { 
    const [user, setuser]= useState<UserProps|null >(null);
    const [loading, setloading]= useState(true); 

    useEffect(() => {
        const unsub= onAuthStateChanged(auth, (user) => {
             if(user){
                  setuser({
                      uis:user.uid,
                      name:user?.displayName,
                      email:user?.email 
                  });
                  setloading(false);
             } else {
                 setuser(null);
                 setloading(false); 
             } 
        })
        return () => {
            // vai desmontar o ollheiro para nao ficar gastanto processamento e perder performance  no componente 
            unsub();
        } 
    }, []) 
    return (
        <AuthContext.Provider value={
                { signed: !!user, 
                  loadingAuth:loading 
                    
                }
            }>
            { children }
        </AuthContext.Provider> 
    )

}

export default AuthProvider;