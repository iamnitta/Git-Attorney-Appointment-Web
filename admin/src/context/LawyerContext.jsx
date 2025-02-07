import { createContext, useState } from "react";

export const LawyerContext = createContext()

const LawyerContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [lawyerToken, setLawyerToken] = useState(localStorage.getItem('lawyerToken')?localStorage.getItem('lawyerToken'):'')

    const value = {
        lawyerToken,setLawyerToken,
        backendUrl
    }

    return (
        <LawyerContext.Provider value={value}>
            {props.children}
        </LawyerContext.Provider>
    )
}

export default LawyerContextProvider