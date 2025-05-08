
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from '../services/firebaseConnection';
interface AuthProviderProps {
    children: ReactNode;
}
interface AuthContextData {
    signed:boolean;
    loadingAuth:boolean;
    user: UserProps | null; 
    handleInfoUser: ({ uid, name, email }: UserProps)=> void;
}
interface UserProps {
    uid:string; 
    name:string  |  null;
    email:string |  null; 
}
export const  AuthContext = createContext({} as AuthContextData); 


export function AuthProvider({ children }:  AuthProviderProps) { 
    const [user, setUser]= useState<UserProps|null >(null);
    const [loading, setloading]= useState(true); 

    useEffect(() => {
        const unsub= onAuthStateChanged(auth, (user) => {
             if(user){
                  setUser({
                      uid:user.uid,
                      name:user?.displayName,
                      email:user?.email 
                  });
                  setloading(false);
             } else {
                setUser(null);
                setloading(false); 
             } 
        })
        return () => {
            // vai desmontar o ollheiro para nao ficar gastanto processamento e perder performance  no componente 
            unsub();
        } 
    }, []) 
     function handleInfoUser({ uid ,name, email}:UserProps){
        setUser({ 
            name,
            email,
            uid
        }) 
     }     
    return (
        <AuthContext.Provider value={
                { signed: !!user, 
                  loadingAuth:loading,
                  user,
                  handleInfoUser 
                    
                }
            }>
            { children }
        </AuthContext.Provider> 
    )

}

export default AuthProvider;