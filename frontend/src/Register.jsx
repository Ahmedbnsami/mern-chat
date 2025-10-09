import { useContext, useState } from "react"
import axios from "axios"
import { UserContext } from "./UserContext"

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login')
    const { setUsername: setLoggedInUsername, setId } = useContext(UserContext)
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode")
        return saved === "true"
    })

    async function handleSubmit(ev) {
        ev.preventDefault()
        const url = isLoginOrRegister === 'register' ? '/register' : '/login'
        const { data } = await axios.post(url, { username, password })
        setLoggedInUsername(username)
        setId(data.id)
    }

    return (
        <div className={`h-screen flex items-center justify-center ${darkMode ? 'dark' : ''}`} style={{
            backgroundColor: darkMode ? 'oklch(0.1 0.1 264)' : 'oklch(0.92 0.1 264)',
            color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)'
        }}>
            <button
                onClick={() => setDarkMode(prev => !prev)}
                className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                    backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(0.92 0.1 264)',
                    color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.4 0.2 264)'
                }}
            >
                {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                    </svg>
                )}
            </button>
            <form onSubmit={handleSubmit} className="w-80 p-6 rounded-2xl shadow-xl" style={{
                backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(0.96 0.1 264)',
                border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
            }}>
                <h1 className="text-2xl font-bold mb-4 text-center">
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </h1>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    placeholder="Username"
                    className="block w-full p-3 mb-4 rounded-lg shadow-sm"
                    style={{
                        backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                        color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                        border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                    }}
                    required
                />
                <input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    className="block w-full p-3 mb-4 rounded-lg shadow-sm"
                    style={{
                        backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                        color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                        border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                    }}
                    required
                />
                <button
                    type="submit"
                    className="w-full p-3 rounded-lg shadow-lg transition-all duration-200 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))',
                        color: 'oklch(1 0.1 264)'
                    }}
                >
                    {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center mt-4">
                    {isLoginOrRegister === 'register' ? (
                        <p>
                            Already a member?{' '}
                            <button
                                onClick={() => setIsLoginOrRegister('login')}
                                className="underline"
                                style={{ color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)' }}
                            >
                                Login Here
                            </button>
                        </p>
                    ) : (
                        <p>
                            New here?{' '}
                            <button
                                onClick={() => setIsLoginOrRegister('register')}
                                className="underline"
                                style={{ color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)' }}
                            >
                                Register Here
                            </button>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}