// app/providers.jsx (Client Component)
"use client";

import { Provider } from "react-redux";
import { store } from "../../store/store";

const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
