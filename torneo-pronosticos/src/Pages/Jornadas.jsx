import { useEffect, useState } from "react";
import supabase from "../Services/supabaseClient";
import { useAuth } from "../Context/AuthContext";
import Navbar from "../Components/Navbar";

function Jornadas() {
    const [partidos, setPartidos] = useState([]);
    const [predicciones, setPredicciones] = useState([]);
    const [modificar, setModificar] = useState(null);
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
        if (!context.usuario) return;
        async function obtenerPredicciones() {
            const { data, error } = await supabase
                .from("predicciones")
                .select("idprediccion, partidoid, resultado")
                .eq("usuarioid", context.usuario.idusuario);
            setPredicciones(data);
        }
        obtenerPredicciones();
    }, [context.usuario]);

    const partidosPorJornada = partidos.reduce((acumulador, partido) => {
        const jornada = partido.jornada;
        if (!acumulador[jornada]) acumulador[jornada] = [];
        acumulador[jornada].push(partido);
        return acumulador;
    }, {});

    async function guardarPronostico(partidoid, resultado) {
        try {
            const { error } = await supabase
                .from("predicciones")
                .insert({
                    usuarioid: context.usuario.idusuario,
                    partidoid: partidoid,
                    resultado: resultado
                });
            if (error) throw error;
            setPredicciones([...predicciones, { partidoid, resultado }]);
        } catch (error) {
            console.error("Error al guardar pronóstico:", error);
        }
    }

    async function cambiarPronosticos(partidoid, resultado, fechapartido) {
        const partidoComenzado = new Date() > new Date(fechapartido);
        if (partidoComenzado) return;
        try {
            const { error } = await supabase
                .from("predicciones")
                .update({ resultado: resultado })
                .eq("partidoid", partidoid)              // 👈 corregido
                .eq("usuarioid", context.usuario.idusuario); // 👈 corregido
            if (error) throw error;
            setPredicciones(predicciones.map(pred =>
                pred.partidoid === partidoid
                    ? { ...pred, resultado: resultado }
                    : pred
            ));
            setModificar(null);
        } catch (error) {
            console.error("Error al editar pronóstico:", error);
        }
    }

    return (
        <>
            <Navbar />
        
        <div className="container-fluid px-3">
            {Object.entries(partidosPorJornada).map(([jornada, partidos]) => (
                <div key={jornada} className="mb-5">
                    <h4 className="text-white fw-bold mb-3">Jornada {jornada}</h4>
                    <div className="row g-3 align-items-stretch">
                        {partidos.map(partido => {
                            const prediccionUsuario = predicciones.find(
                                pred => pred.partidoid === partido.idpartido
                            );
                            const partidoComenzado = new Date() > new Date(partido.fechapartido);

                            return (
                                <div key={partido.idpartido} className="col-12 col-sm-6 col-xl-4">
                                    <div className="card bg-dark bg-opacity-75 text-white border-0 shadow">
                                        <div className="card-body p-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-semibold text-truncate">{partido.equipolocal}</span>
                                                <span className="badge bg-primary mx-2">VS</span>
                                                <span className="fw-semibold ">{partido.equipovisitante}</span>
                                            </div>
                                            <div className="mt-3">
                                                {prediccionUsuario ? (
                                                    // ✅ Ya tiene pronóstico
                                                    <div className="text-center d-flex flex-column align-items-center gap-2">
                                                        <span className="badge bg-success p-2">
                                                            Tu pronóstico: {prediccionUsuario.resultado}
                                                        </span>
                                                        <span className="badge bg-danger p-2">
                                                            Resultado Final: {partido.resultadopartido ?? "Pendiente"}
                                                        </span>
                                                        {!partidoComenzado && modificar !== partido.idpartido && (
                                                            <button
                                                                className="btn btn-sm btn-outline-light"
                                                                onClick={() => setModificar(partido.idpartido)}
                                                            >
                                                                Cambiar
                                                            </button>
                                                        )}
                                                        {modificar === partido.idpartido && (
                                                            <div className="d-flex gap-2 flex-wrap justify-content-center">
                                                                <button className="btn btn-sm btn-outline-light"
                                                                    onClick={() => cambiarPronosticos(partido.idpartido, "Local", partido.fechapartido)}>
                                                                    Local
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-light"
                                                                    onClick={() => cambiarPronosticos(partido.idpartido, "Empate", partido.fechapartido)}>
                                                                    Empate
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-light"
                                                                    onClick={() => cambiarPronosticos(partido.idpartido, "Visita", partido.fechapartido)}>
                                                                    Visita
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => setModificar(null)}>
                                                                    Cancelar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    // ✅ No tiene pronóstico aún
                                                    <div className="d-flex justify-content-center gap-2 mt-2">
                                                        <button className="btn btn-sm btn-outline-light"
                                                            disabled={partidoComenzado}
                                                            onClick={() => guardarPronostico(partido.idpartido, "Local")}>
                                                            Local
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-light"
                                                            disabled={partidoComenzado}
                                                            onClick={() => guardarPronostico(partido.idpartido, "Empate")}>
                                                            Empate
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-light"
                                                            disabled={partidoComenzado}
                                                            onClick={() => guardarPronostico(partido.idpartido, "Visita")}>
                                                            Visita
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
        </>
    );
}

export default Jornadas;