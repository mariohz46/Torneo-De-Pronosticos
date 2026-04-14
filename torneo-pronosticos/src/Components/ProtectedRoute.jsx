import { useEffect, useState } from 'react';
import supabase from '../Services/supabaseClient';
import {Navigate} from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";


function ProtectedRoute({children, requireAdmin= false}){
    const [session,setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const usuario = useAuth();
    
    useEffect(()=>{
        const verificacionSession =  async () =>{
            try {
                const {data} =await supabase.auth.getSession();
                if(data.session){
                 setSession(data.session);
                }
                setLoading(false);
            } catch (error) {
             console.log("Ocurrio un error al intentar verificar la sesion",error);
            }
        }
        verificacionSession()
    }, []);
    if (requireAdmin && usuario?.rol !=='admin'){
        return <Navigate to={'/'}/>
    }
    if (loading) return null;
    if(!session) return <Navigate to={"/"}/>
    return children;
}

export default ProtectedRoute;