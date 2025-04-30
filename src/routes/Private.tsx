
import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateProps {
     children: ReactNode 
}
export function Private( { children}: PrivateProps) {

    const { signed , loadingAuth} = useContext(AuthContext); 
     
    if(loadingAuth){
        return <div> <h1>Carregando...</h1> </div>
    } 

    if(!signed){
        return <Navigate to="/login" />
    } 
    return children;
} 