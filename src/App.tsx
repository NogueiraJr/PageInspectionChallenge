import React, { useState } from "react";
import "./menu.css";
import { Cadastro } from "./Cadastro";
import { Consulta } from "./Consulta";
import { Historico } from "./Historico";

export interface Solicitacao {
    id: string;
    status: string;
    urls: string[];
}

export interface Resultado {
    id: string;
    status: string;
    urls: string[];
}

export type PageProps = {
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

export default App;
