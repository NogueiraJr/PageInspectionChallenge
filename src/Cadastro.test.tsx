import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Cadastro } from "./Cadastro";

describe("Cadastro", () => {
  it("deve enviar uma solicitação de inspeção quando o formulário é enviado", async () => {
    // Mock da função handleReturn
    const handleReturn = jest.fn();

    // Renderiza o componente
    render(<Cadastro handleReturn={handleReturn} />);

    // Simula a digitação da chave
    const input = screen.getByLabelText("Chave:");
    fireEvent.change(input, { target: { value: "minha chave" } });

    // Simula o envio do formulário
    const submitButton = screen.getByText("Enviar");
    fireEvent.click(submitButton);

    // Aguarda a resposta da solicitação
    await waitFor(() => expect(localStorage.getItem("mocked-id")).toBeDefined());

    // Verifica se a solicitação foi armazenada no localStorage
    const storedData = localStorage.getItem("mocked-id");
    if (storedData !== null) {
      const parsedData = JSON.parse(storedData);
      expect(parsedData.keyword).toBe("minha chave");
    }

    // Verifica se o console exibe o resultado da solicitação
    expect(console.log).toHaveBeenCalledWith(storedData);
  });
});
