import { render, screen } from "@testing-library/react";
import { Historico } from "./Historico";

describe("<Historico />", () => {
    const mockSolicitacoes = [
        { id: 1, status: "Concluído" },
        { id: 2, status: "Em andamento" },
        { id: 3, status: "Pendente" },
    ];

    const mockPageProps = {
        handleReturn: jest.fn(),
    };

    it("renders without crashing", () => {
        render(<Historico {...mockPageProps} />);
    });

    it("renders a table with the correct data when there are solicitacoes", () => {
        jest.spyOn(window.localStorage, "getItem").mockImplementation((key) => {
            return JSON.stringify(mockSolicitacoes[parseInt(key) - 1]);
        });

        render(<Historico {...mockPageProps} />);

        mockSolicitacoes.forEach((solicitacao) => {
            const id = screen.getByText(solicitacao.id.toString());
            expect(id).toBeInTheDocument();

            const status = screen.getByText(solicitacao.status);
            expect(status).toBeInTheDocument();
        });

    });

    it("renders a table with example data when there are no solicitacoes", () => {
        jest.spyOn(window.localStorage, "getItem").mockReturnValue(null);

        render(<Historico {...mockPageProps} />);

        const concluidoStatus = screen.getByText("Concluído");
        expect(concluidoStatus).toBeInTheDocument();

        const concluidoUrls = screen.getByText(
            "https://www.exemplo.com, https://www.exemplo2.com"
        );
        expect(concluidoUrls).toBeInTheDocument();

        const emAndamentoStatus = screen.getByText("Em andamento");
        expect(emAndamentoStatus).toBeInTheDocument();

        const emAndamentoUrls = screen.getByText(
            "https://www.exemplo3.com, https://www.exemplo4.com"
        );
        expect(emAndamentoUrls).toBeInTheDocument();

        const pendenteStatus = screen.getByText("Pendente");
        expect(pendenteStatus).toBeInTheDocument();

        const pendenteUrls = screen.getByText(
            "https://www.exemplo5.com, https://www.exemplo6.com"
        );
        expect(pendenteUrls).toBeInTheDocument();


    });
});