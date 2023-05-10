import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { Consulta } from "./Consulta";

describe("Consulta", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Consulta handleReturn={() => {}} />);
    expect(getByText("Consulta do resultado de uma inspeção já cadastrada")).toBeInTheDocument();
  });

  it("displays the results correctly", async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    global.localStorage = localStorageMock as any;

    // Mock fetch
    const response = { id: "id123", status: "success", urls: ["http://example.com"] };
    const fetchMock = jest.fn().mockResolvedValue({ json: () => response });
    global.fetch = fetchMock as any;

    const { getByLabelText, getByText } = render(<Consulta handleReturn={() => {}} />);

    // Set chave input value
    const input = getByLabelText("Chave:");
    fireEvent.change(input, { target: { value: "123" } });

    // Submit form
    const submitButton = getByText("Enviar");
    fireEvent.click(submitButton);

    // Wait for fetch and local storage
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("http://testapp.axreng.com:3000/crawl/123", { method: "GET" });
      expect(localStorageMock.setItem).toHaveBeenCalledWith("id123", JSON.stringify(response));
    });

    // Check if table with results is displayed
    const table = getByText("ID");
    expect(table).toBeInTheDocument();

    // Check if results are displayed correctly
    const idCell = getByText("id123");
    const statusCell = getByText("success");
    const urlsCell = getByText("http://example.com");
    expect(idCell).toBeInTheDocument();
    expect(statusCell).toBeInTheDocument();
    expect(urlsCell).toBeInTheDocument();
  });
});
