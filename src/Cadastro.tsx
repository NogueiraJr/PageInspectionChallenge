import React, { useState } from "react";
import { PageProps } from "./App";

export function Cadastro({ handleReturn }: PageProps) {
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
            const data = await response.json();
            const id = data.id;
            const existingData = localStorage.getItem(id);
            if (!existingData) {
                localStorage.setItem(id, JSON.stringify(data));
            }
            console.log(data);
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
