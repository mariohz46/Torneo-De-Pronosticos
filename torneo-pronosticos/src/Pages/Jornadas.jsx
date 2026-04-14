import { useEffect, useState } from "react";
import supabase from "../Services/supabaseClient";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";

function Jornadas() {
    const [partidos, setPartidos] = useState([]);
    const [predicciones, setPredicciones] = useState([]);
    const context = useAuth();
    useEffect(() => {
        async function obtenerPartidos() {
            const { data, error } = await supabase
                .from("partidos")
                .select("idpartido, equipolocal, equipovisitante, resultadopartido, jornada, goleslocal, golesvisita, fechapartido")
            setPartidos(data);
        }
        obtenerPartidos();
    }, []);

    useEffect(() => {
        if (!context.usuario) return
        async function obtenerPredicciones() {
            const { data, error } = await supabase
                .from("predicciones")
                .select("idprediccion, partidoid,resultado")
                .eq("usuarioid", context.usuario.idusuario);

            setPredicciones(data);
        }
        obtenerPredicciones();
    }, [context.usuario]);

    const partidosPorJornada = partidos.reduce((acumulador, partido) => {
        const jornada = partido.jornada;

        if (!acumulador[jornada]) {
            acumulador[jornada] = []; // crea el array si no existe
        }

        acumulador[jornada].push(partido); // agrega el partido a su jornada

        return acumulador;
    }, {});


    return (
    <div className="container mt-4">
        <Navbar/>
        {Object.entries(partidosPorJornada).map(([jornada, partidos]) => (
            <div key={jornada} className="mb-5">
                <h4 className="text-white fw-bold mb-3">Jornada {jornada}</h4>
                <div className="row g-3">
                    {partidos.map(partido => (
                        <div key={partido.idpartido} className="col-12 col-md-6 col-lg-4">
                            <div className="card bg-dark bg-opacity-75 text-white border-0 shadow">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-semibold">{partido.equipolocal}</span>
                                        <span className="badge bg-primary mx-2">VS</span>
                                        <span className="fw-semibold">{partido.equipovisitante}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
)
}


export default Jornadas;