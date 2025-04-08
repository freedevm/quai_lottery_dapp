import { useContext } from "react";

import { AppContext } from "../providers/AppContextProvider";

export const useAppContext = () => useContext(AppContext);

export default useAppContext;
