// import { render, screen } from '@testing-library/react';

import React from "react";
import { fireEvent, render, screen } from "../utils/test-utils";
import TopicsPage from "../pages/TopicsPage";

describe("test for TopicsPage", () => {
  it('should display "Add a new Topic" on first render', () => {
    render(<TopicsPage />);
    const h1Element = screen.getByText(/Add a new Topic/i);
    expect(h1Element).toBeInTheDocument();
  });

  it("should update fiefd as user types into name field", () => {
    render(<TopicsPage />);
    const inputElement = screen.getByTestId("topic-name") as HTMLInputElement;
    fireEvent.change(inputElement, {
      target: { value: "WIZKID" },
    });

    expect(inputElement.value).toBe("WIZKID");
  });

  it("should update field as user types into descrption field", () => {
    render(<TopicsPage />);
    const textAreaElement = screen.getByTestId(
      "topic-desc"
    ) as HTMLTextAreaElement;
    fireEvent.change(textAreaElement, {
      target: { value: "GREATEST ARTISTS OF ALL TIME" },
    });

    expect(textAreaElement.value).toBe("GREATEST ARTISTS OF ALL TIME");
  });
});
