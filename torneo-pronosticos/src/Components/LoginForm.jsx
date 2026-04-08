import { useState } from "react";
import supabase from '../Services/supabaseClient';
import { useNavigate } from 'react-router-dom'
import "../Styles/LoginForm.css"



function LoginForm() {
    const [correo,setCorreo] = useState('');
    const [contraseña,setContraseña] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () =>{
        try {
            const {data, error} =await supabase.auth.signInWithPassword({
                email:correo,
                password:contraseña
            });

            if (error) throw error ;
            navigate('/Dashboard');
        } catch (error) {
            setError('Correo o contraseña incorrecto ');
        }
    }




    return (

        <form action="" className="form-group">
            <div className="mb-3 bg p-5 rounded">
                <h2 className="text-center font-color">Torneito De Pronosticos 2026</h2>
                <label htmlFor="exampleFormControlInput1" className="form-label labelFont-color mt-4 fw-semibold">Correo</label>
                <input type="email" 
                    className="form-control" 
                    id="correo" 
                    placeholder="name@example.com"
                    value={correo} 
                    onChange={(e) => setCorreo(e.target.value)}
                    />
                <label htmlFor="exampleFormControlInput1" className="form-label labelFont-color mt-3 fw-semibold">Contraseña</label>
                <input 
                    type="password" 
                    className="form-control" 
                    id="contraseña" 
                    value={contraseña}
                    onChange={(e)=> setContraseña(e.target.value)}
                    />
                <button type="button" className="btn btn-primary btn-color mt-3 col-12" onClick={handleLogin}>Iniciar Sesion</button>
                {error && <p className="text-danger">{error}</p>}
            </div>

        </form>
    )
}

export default LoginForm;