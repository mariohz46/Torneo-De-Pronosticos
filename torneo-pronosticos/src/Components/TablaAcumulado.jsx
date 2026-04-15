import '../Styles/TablaAcumulado.css'
import { useEffect, useState } from 'react';
import supabase from '../Services/supabaseClient';



function TablaAcumulado() {
    const [participantes, setParticipantes] = useState([]);
    


    useEffect(() => {
        async function obtenerParticipantes() {
            const { data, error } = await supabase
                .from("usuarios")
                .select(`
                         nombreusuario,
                         idusuario,
                         predicciones (
                         resultado,
                         partidos (
                        resultadopartido))  `)

            if (data) {
                const ordenado = data.sort((a, b) => {
                    const puntosA = a.predicciones.filter(
                        pred => pred.resultado === pred.partidos.resultadopartido
                    ).length * 3;

                    const puntosB = b.predicciones.filter(
                        pred => pred.resultado === pred.partidos.resultadopartido
                    ).length * 3;

                    return puntosB - puntosA;
                });
                console.log(data);
                setParticipantes(ordenado);
            }

        }
        obtenerParticipantes();
    }, []);

    return (
    <div className="container-fluid px-3 mt-3">
        <div className="row">
            <div className="col-12">
                <div style={{overflowX: "auto"}}> {/* 👈 agrega este div */}
                    <table className="table table-striped table-hover">
                        <thead className="color-thead">
                            <tr>
                                <th>#</th>
                                <th>Participante</th>
                                <th>Partidos</th>
                                <th>Aciertos</th>
                                <th>% Aciertos</th>
                                <th>PTS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participantes.map((p, index) => {
                                const aciertos = p.predicciones.filter(
                                    pred => pred.resultado === pred.partidos.resultadopartido
                                ).length;

                                const puntos = aciertos * 3;
                                const totalPartidos = p.predicciones.length;
                                const porcentaje = totalPartidos > 0
                                    ? Math.round((aciertos / totalPartidos) * 100)
                                    : 0;

                                return (
                                    <tr key={p.idusuario}>
                                        <td>{index + 1}</td>
                                        <td>{p.nombreusuario}</td>
                                        <td>{totalPartidos}</td>
                                        <td>{aciertos}</td>
                                        <td>{porcentaje}%</td>
                                        <td>{puntos}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
}

export default TablaAcumulado;