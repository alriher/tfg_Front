import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider.tsx";
import SearchProvider from "./providers/SearchProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
