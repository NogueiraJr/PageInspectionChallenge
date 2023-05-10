import React, { useState } from "react";
import { useEffect } from "react";
import { PageProps, Resultado } from "./App";

export function Consulta({ handleReturn }: PageProps) {
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
            localStorage.setItem(json.id, JSON.stringify(json));

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

    useEffect(() => {
        const results = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("id")) {
                const result = JSON.parse(localStorage.getItem(key) ?? "");
                results.push(result);
            }
        }
        setResultado(results);
    }, []);


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
                        onChange={handleChaveChange} />
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
