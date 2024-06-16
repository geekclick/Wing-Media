import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { SocketProvider } from "./socket.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SocketProvider>
      <Provider store={store}>
        <NextUIProvider>
          <main className="text-foreground bg-white">
            <App />
          </main>
        </NextUIProvider>
      </Provider>
    </SocketProvider>
  </React.StrictMode>
);
