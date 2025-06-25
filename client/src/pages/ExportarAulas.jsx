import { useEffect, useState } from "react";
import axios from "axios";
import {
    exportAulasListaToPdf,
    exportAulasListaToExcel
} from "../utils/exportFunctions";
import "../styles/exportarAulas.css";


const ExportarAulas = () => {
    const [docentes, setDocentes] = useState([]);
    const [salas, setSalas] = useState([]);
    const [anos, setAnos] = useState([]);

    const [codAno, setCodAno] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState(""); // "docente" ou "sala"
    const [valorFiltro, setValorFiltro] = useState("");

    const [aulas, setAulas] = useState([]);
    const [erro, setErro] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5170/getDocente").then((res) => setDocentes(res.data));
        axios.get("http://localhost:5170/getSala").then((res) => setSalas(res.data));
        axios.get("http://localhost:5170/getAnoSemestre").then((res) => setAnos(res.data));
    }, []);

    const exportarAulas = async () => {
        try {
            setErro("");
            if (!codAno || !tipoFiltro || !valorFiltro)
                return setErro("Preencha todos os campos obrigatórios.");

            let url = "";
            if (tipoFiltro === "docente")
                url = `http://localhost:5170/aulas/docente/${valorFiltro}/ano/${codAno}`;
            else if (tipoFiltro === "sala")
                url = `http://localhost:5170/aulas/sala/${valorFiltro}/ano/${codAno}`;
            else
                return setErro("Tipo de filtro inválido.");

            const res = await axios.get(url);
            setAulas(res.data);
        } catch (err) {
            setErro("Erro ao obter as aulas.");
        }
    };

    const renderSelectFiltro = () => {
        if (tipoFiltro === "docente") {
            return (
                <select value={valorFiltro} onChange={(e) => setValorFiltro(e.target.value)}>
                    <option value="">Selecione um docente</option>
                    {docentes.map((d) => (
                        <option key={d.Cod_Docente} value={d.Cod_Docente}>
                            {d.Nome}
                        </option>
                    ))}
                </select>
            );
        } else if (tipoFiltro === "sala") {
            return (
                <select value={valorFiltro} onChange={(e) => setValorFiltro(e.target.value)}>
                    <option value="">Selecione uma sala</option>
                    {salas.map((s) => (
                        <option key={s.Cod_Sala} value={s.Cod_Sala}>
                            {s.Nome}
                        </option>
                    ))}
                </select>
            );
        }
        return null;
    };

    return (
        <div className="exportar-aulas-container">
            <h2>Exportar Aulas</h2>

            {erro && <p style={{ color: "red" }}>{erro}</p>}

            <div style={{ marginBottom: "1rem" }}>
                <label>Semestre:</label><br />
                <select value={codAno} onChange={(e) => setCodAno(e.target.value)}>
                    <option value="">Selecione o semestre</option>
                    {anos.map((a) => (
                        <option key={a.Cod_AnoSemestre} value={a.Cod_AnoSemestre}>
                            {a.Nome}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                <label>Filtrar por:</label><br />
                <select value={tipoFiltro} onChange={(e) => {
                    setTipoFiltro(e.target.value);
                    setValorFiltro("");
                }}>
                    <option value="">Escolha o tipo de filtro</option>
                    <option value="docente">Docente</option>
                    <option value="sala">Sala</option>
                </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
                {renderSelectFiltro()}
            </div>

            <button onClick={exportarAulas}>Carregar Aulas</button>

            {aulas && (
                <div style={{ marginTop: "2rem" }}>
                    {aulas.length > 0 ? (
                        <>
                            <h4>Aulas encontradas: {aulas.length}</h4>
                            <button onClick={() => exportAulasListaToPdf(aulas)}>Exportar para PDF</button>
                            <button onClick={() => exportAulasListaToExcel(aulas)}>Exportar para Excel</button>
                        </>
                    ) : (
                        <p>Nenhuma aula encontrada para os critérios selecionados.</p>
                    )}
                </div>
            )}

        </div>
    );
};

export default ExportarAulas;
