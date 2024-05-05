import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import Router from "../Router.jsx";
import Container from "./Container.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Container>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
        </Container>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
