import React from "react";
import { fireEvent, render, screen, waitFor } from "../utils/test-utils";
import TopicsPage from "../pages/TopicsPage";

import userEvent from "@testing-library/user-event";

const stringInput = "GREATEST ARTISTS OF ALL TIME";

describe("test for TopicsPage", () => {
  it('should display "Add a new Topic" on first render', () => {
    render(<TopicsPage />);
    const h1Element = screen.getByText(/Add a new Topic/i);
    expect(h1Element).toBeInTheDocument();
  });

  it("should update field as user types into name field", () => {
    render(<TopicsPage />);
    const inputElement = screen.getByTestId("topic-name") as HTMLInputElement;
    userEvent.type(inputElement, stringInput);

    expect(inputElement.value).toBe(stringInput);
  });

  it("should update field as user types into descrption field", () => {
    render(<TopicsPage />);
    const textAreaElement = screen.getByTestId(
      "topic-desc"
    ) as HTMLTextAreaElement;

    userEvent.type(textAreaElement, stringInput);
    expect(textAreaElement.value).toBe(stringInput);
  });

  it("should fetch topics and have the correct list of topics length", async () => {
    render(<TopicsPage />);
    const rowLists = await screen.findAllByTestId("tableItems");
    expect(rowLists).toHaveLength(2);
  });

  it("should add a new topic to the list", async () => {
    render(<TopicsPage />);

    const inputElement = screen.getByTestId("topic-name") as HTMLInputElement;
    userEvent.type(inputElement, stringInput);

    const textAreaElement = screen.getByTestId(
      "topic-desc"
    ) as HTMLTextAreaElement;
    userEvent.type(textAreaElement, stringInput);

    const addNewTopicBtn = screen.getByTestId(
      "addNewTopicBtn"
    ) as HTMLButtonElement;

    userEvent.click(addNewTopicBtn);

    const rowLists = await screen.findAllByTestId("tableItems");

    expect(rowLists).toHaveLength(2);
  });

  it("should edit an existing topic on the list", async () => {
    render(<TopicsPage />);

    const editTableItemBtn = await screen.findByTestId("editTableItemBtn-1");
    userEvent.click(editTableItemBtn);

    const inputElement = screen.getByTestId("topic-name") as HTMLInputElement;
    userEvent.clear(inputElement);
    userEvent.type(inputElement, stringInput);

    const textAreaElement = screen.getByTestId(
      "topic-desc"
    ) as HTMLTextAreaElement;
    userEvent.clear(textAreaElement);
    userEvent.type(textAreaElement, stringInput);

    const addNewTopicBtn = screen.getByTestId(
      "addNewTopicBtn"
    ) as HTMLButtonElement;
    userEvent.click(addNewTopicBtn);

    await waitFor(async () => {
      const name = await screen.findByTestId("tableItemName-1");
      const desc = await screen.findByTestId("tableItemDesc-1");

      expect(name).toHaveTextContent(stringInput);
      expect(desc).toHaveTextContent(stringInput);
    });

    
  });

  it("should delete an existing topic on the list", async () => {
    render(<TopicsPage />);

    const deleteTableItemBtn = (await screen.findByTestId(
      "deleteTableItemBtn-1"
    )) as HTMLButtonElement;
    userEvent.click(deleteTableItemBtn);

    await waitFor(() => {
      const rowLists = screen.getAllByTestId("tableItems");
      expect(rowLists).toHaveLength(1);
    });
  });
});
