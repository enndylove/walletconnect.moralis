import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Creates a root element for the React application.
 *
 * @param {HTMLElement} element - The HTML element to render the application to.
 * @returns {ReactDOM.Root} - The root element of the React application.
 *
 * Example:
 * const root = ReactDOM.createRoot(document.getElementById('root'));
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Renders the React application to the root element.
 *
 * @param {JSX.Element} element - The JSX element to render.
 *
 * Example:
 * root.render(<App />);
 */
root.render(
    /**
     * Wraps the application in a Strict Mode component, which enables additional checks and warnings.
     *
     * @param {JSX.Element} children - The JSX element to wrap.
     *
     * Example:
     * <React.StrictMode>
     *   <App />
     * </React.StrictMode>
     */
    <React.StrictMode>
        <App />
    </React.StrictMode>
);