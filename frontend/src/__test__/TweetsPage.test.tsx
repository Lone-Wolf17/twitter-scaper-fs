import React from "react";
import { fireEvent, render, screen } from "../utils/test-utils";
import TweetsPage from "../pages/TweetsPage";
import userEvent from "@testing-library/user-event";

const stringInput = "Hello World";
describe("TWeets Page Tests", () => {
  it("should update search box as a user types", () => {
    render(<TweetsPage />);
    const searchBox = screen.getByRole("searchbox") as HTMLInputElement;
    userEvent.type(searchBox, stringInput);

    expect(searchBox).toHaveValue(stringInput);
  });
  it("should change orderBy select Value to desc", () => {
    render(<TweetsPage />);
    const selectBox = screen.getByTestId(
      "orderBySelectBox"
    ) as HTMLSelectElement;
    fireEvent.change(selectBox, { target: { value: "desc" } });

    expect(selectBox).toHaveValue("desc");
  });

  it("should have 2 tweets on TweetTable on first render", async () => {
    render(<TweetsPage />);

    const tweetTableItems = await screen.findAllByTestId("tweetTableItems");

    expect(tweetTableItems).toHaveLength(2);
  });

  it("should reset all input values to default when reset button is clicked", async () => {
    render(<TweetsPage />);

    const searchBox = screen.getByRole("searchbox") as HTMLInputElement;
    userEvent.type(searchBox, stringInput);

    const selectBox = screen.getByTestId(
      "orderBySelectBox"
    ) as HTMLSelectElement;
    fireEvent.change(selectBox, { target: { value: "asc" } });

    const resetBtn = (await screen.findByTestId(
      "resetBtn"
    )) as HTMLButtonElement;
    userEvent.click(resetBtn);

    expect(searchBox).toHaveValue("");
    expect(selectBox).toHaveValue("desc");
  });
});
