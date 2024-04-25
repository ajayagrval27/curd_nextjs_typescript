"use client";

import { NextUIProvider } from "@nextui-org/react";
import RegistrationPage from "./registration/page";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export default function Home() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NextUIProvider>
            <RegistrationPage />
          </NextUIProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
