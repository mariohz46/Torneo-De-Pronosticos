import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../Services/supabaseClient";



export const AuthContext = createContext();

export function AuthProvider({children}){
    const[usuario, setUsuario] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                supabase
                    .from("usuarios")
                    .select("idusuario, nombreusuario, rol")
                    .eq("email", session.user.email)
                    .single()
                    .then(({ data }) => {
                        if (data) setUsuario(data);
                    });
            }
        });
    }, []);

    return(
        <AuthContext.Provider value={{usuario,setUsuario}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);