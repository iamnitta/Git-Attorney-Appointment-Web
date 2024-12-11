import { createContext } from "react";
import { lawyers } from "../assets/assets"

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const value = {
        lawyers
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider