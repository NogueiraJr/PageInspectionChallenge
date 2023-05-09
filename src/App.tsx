import React, { useState } from "react";
import { useEffect } from "react";
import "./menu.css";

interface Solicitacao {
    status: string;
    urls: string[];
}

type PageProps = {
    handleReturn: () => void;
};

function App() {
    const [activeMenu, setActiveMenu] = useState("");

    const handleClick = (menuName: string) => {
        setActiveMenu(menuName);
    };

    const handleReturn = () => {
        setActiveMenu("");
    };

    const renderMenu = () => {
        return (
            <div className="menu-container">
                <div
                    className={`menu-item ${activeMenu === "cadastro" ? "active" : ""}`}
                    onClick={() => handleClick("cadastro")}
                >
                    Cadastro de uma solicitação de inspeção
                </div>
                <div
                    className={`menu-item ${activeMenu === "consulta" ? "active" : ""}`}
                    onClick={() => handleClick("consulta")}
                >
                    Consulta do resultado de uma inspeção já cadastrada
                </div>
                <div
                    className={`menu-item ${activeMenu === "historico" ? "active" : ""}`}
                    onClick={() => handleClick("historico")}
                >
                    Visualização do histórico recente de solicitações cadastradas
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeMenu) {
            case "cadastro":
                return <Cadastro handleReturn={handleReturn} />;
            case "historico":
                return <Historico handleReturn={handleReturn} />;
            case "consulta":
                return <Consulta handleReturn={handleReturn} />;
            default:
                return renderMenu();
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title_a">Automação de busca de termos</h1>
            {renderContent()}
        </div>
    );
}

function Cadastro({ handleReturn }: PageProps) {
    const [chave, setChave] = useState("");

    const handleChaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChave(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch("http://testapp.axreng.com:3000/crawl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    keyword: chave
                })
            });
            console.log(await response.json());
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title_b">Cadastro de uma solicitação de inspeção</h2>
            <form onSubmit={handleSubmit}>
                <div className="text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <label htmlFor="chave">Chave:</label>
                    <input type="text" id="chave" value={chave} onChange={handleChaveChange} />
                </div>
                <button type="submit" className="submit-button">
                    Enviar
                </button>
            </form>
            <button className="return-button" onClick={handleReturn}>
                Voltar
            </button>
        </div>
    );
}

interface Resultado {
    id: number;
    status: string;
    urls: string[];
}

function Consulta({ handleReturn }: PageProps) {
    const [chave, setChave] = useState("");
    const [resultado, setResultado] = useState<Resultado[]>([]);

    const handleChaveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChave(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch(
                `http://testapp.axreng.com:3000/crawl/${chave}`,
                {
                    method: "GET",
                }
            );
            const json = await response.json();

            // Armazena o resultado em um armazenamento local no browser
            setResultado((prev) => {
                const index = prev.findIndex((item) => item.id === json.id);
                if (index >= 0) {
                    prev[index] = json;
                    return [...prev];
                } else {
                    return [...prev, json];
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-title_b">
                Consulta do resultado de uma inspeção já cadastrada
            </h2>
            <form onSubmit={handleSubmit}>
                <div
                    className="text-center"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    <label htmlFor="chave">Chave:</label>
                    <input
                        type="text"
                        id="chave"
                        value={chave}
                        onChange={handleChaveChange}
                    />
                </div>
                <button type="submit" className="submit-button">
                    Enviar
                </button>
            </form>

            {/* Exibe a grade de dados formatada */}
            {resultado.length > 0 && (
                <table style={{ margin: "auto", marginTop: "50px", borderCollapse: "collapse", textAlign: "center" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#ddd" }}>
                            <th style={{ padding: "10px" }}>ID</th>
                            <th style={{ padding: "10px" }}>Status</th>
                            <th style={{ padding: "10px" }}>URLs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultado.map((item) => (
                            <tr key={item.id}>
                                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                                    {item.id}
                                </td>
                                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                                    {item.status}
                                </td>
                                <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                                    {item.urls.join(", ")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button className="return-button" onClick={handleReturn}>
                Voltar
            </button>

        </div>
    );
}

function Historico({ handleReturn }: PageProps) {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [erro, setErro] = useState<boolean>(false);

    useEffect(() => {
        async function fetchSolicitacoes() {
            try {
                const response = await fetch("http://testapp.axreng.com:3000/inspections");
                const data = await response.json();
                setSolicitacoes(data);
            } catch (error) {
                console.error(error);
                setErro(true);
            }
        }
        fetchSolicitacoes();
    }, []);

    return (
        <div className="page-container">
            <h2 className="page-title_b">
                Visualização do histórico recente de solicitações cadastradas
            </h2>
            {erro ? (
                <>
                    <p>Não existem itens reais a serem exibidos.</p>
                    <p>Segue exemplo da lista para demonstrar a formação da tabela e dados:</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Status da Solicitação</th>
                                <th>Lista de URLs</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Concluído</td>
                                <td>https://www.exemplo.com, https://www.exemplo2.com</td>
                            </tr>
                            <tr>
                                <td>Em andamento</td>
                                <td>https://www.exemplo3.com, https://www.exemplo4.com</td>
                            </tr>
                            <tr>
                                <td>Pendente</td>
                                <td>https://www.exemplo5.com, https://www.exemplo6.com</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Status da Solicitação</th>
                            <th>Lista de URLs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitacoes.map((solicitacao, index) => (
                            <tr key={index}>
                                <td>{solicitacao.status}</td>
                                <td>{solicitacao.urls.join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="return-button" onClick={handleReturn}>
                Voltar
            </button>
        </div>
    );
}

export default App;
