import React, { useState } from "react";
import { useEffect } from "react";
import { PageProps, Solicitacao } from "./App";

export function Historico({ handleReturn }: PageProps) {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [erro, setErro] = useState<boolean>(false);

    useEffect(() => {
        const storage = window.localStorage;
        const keys = Object.keys(storage);
        const data = keys.map(key => JSON.parse(storage.getItem(key)!));
        setSolicitacoes(data);
    }, []);

    return (
        <div className="page-container">
            <h2 className="page-title_b">
                Visualização do histórico recente de solicitações cadastradas
            </h2>
            {erro ? (
                <>
                    <p>Não existem itens reais a serem exibidos.</p>
                    <p>
                        Segue exemplo da lista para demonstrar a formação da tabela e dados:
                    </p>
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
                            <th>ID da Solicitação</th>
                            <th>Status da Solicitação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitacoes.map((solicitacao, index) => (
                            <tr key={index}>
                                <td>
                                    <a>{solicitacao.id}</a>
                                </td>
                                <td>{solicitacao.status}</td>
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
