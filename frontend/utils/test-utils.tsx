import React, {ReactElement} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';

import {appTheme} from '../src/App';

const AllTheProviders = ({children}: {
    children: React.ReactNode
}) => {
    return (
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    );
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, {wrapper: AllTheProviders, ...options});

export * from "@testing-library/react";
export { customRender as render };