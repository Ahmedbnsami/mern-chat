import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({})

export function UserContextProvider({children}) {
    const [username, setUsername] = useState(null)
    const [id, setId] = useState(null)
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode")
        return saved === "true" 
    })

    useEffect(() => {
        axios.get('/profile').then(res => {
            setUsername(res.data.username)
            setId(res.data.id)
        })
    }, [])

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode)
    }, [darkMode])

    return (
        <UserContext.Provider value={{
            username, setUsername, id, setId, darkMode, setDarkMode
        }}>
            {children}
        </UserContext.Provider>
    )
}

