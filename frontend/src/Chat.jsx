import { useContext, useEffect, useState, useRef } from "react"
import { uniqBy } from "lodash"
import Logo from "./Logo"
import { UserContext } from "./UserContext"
import axios from "axios"
import Contact from "./Contact"

export default function Chat(){
    const [ws, setWs] = useState(null)
    const [onlinePeople, setOnlinePeople] = useState({})
    const [offlinePeople, setOfflinePeople] = useState({})
    const [selectedUserId, setSelectedUserId] = useState(null)
    const selectedUserIdRef = useRef(null)
    const [newMessageText, setNewMessageText] = useState("")
    const [messages, setMessages] = useState([])
    const [showSidebar, setShowSidebar] = useState(true)
    const [summarizationText, setSummarizationText] = useState("")
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode")
        return saved === "true"
    })
    const { username, id, setId, setUsername } = useContext(UserContext)
    const divUnderMessages = useRef()
    const textareaRef = useRef()
    const [showPopup, setShowPopup] = useState(false)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        connectToWs()
    }, [])

    function connectToWs() {
        const ws = new WebSocket("ws://mern-chat-production-e502.up.railway.app")
        setWs(ws)
        ws.addEventListener("message", handleMessage)
        ws.addEventListener("close", () => {
            console.log("WS closed. Reconnecting…")
            setTimeout(connectToWs, 1000)
        })
    }

    function showOnlinePeople(peopleArray) {
        const people = {}
        peopleArray.forEach(({ userId, userName }) => {
            people[userId] = userName
        })
        setOnlinePeople(people)
    }

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data)
        console.log(`Message received: ${JSON.stringify(messageData)}`);
        console.log("Current selectedUserId:", selectedUserIdRef.current); // ✅ use ref here

        if ('online' in messageData) {
            showOnlinePeople(messageData.online)
        } else if ("text" in messageData) {
            if (selectedUserIdRef.current && messageData.sender === selectedUserIdRef.current) {
                setMessages(prev => [...prev, messageData])
            }
        }
    }

    // 🔑 Keep ref in sync with selectedUserId
    useEffect(() => {
        selectedUserIdRef.current = selectedUserId
    }, [selectedUserId])

    useEffect(() => {   
        localStorage.setItem("darkMode", darkMode)
    }, [darkMode])

    function handleDarkModeToggle(){
        setDarkMode(prev => !prev)
    }

    function logout() {
        axios.post('/logout').then(() => {
            setWs(null)
            setId(null)
            setUsername(null)
        })
        window.location.reload()
    }

    function adjustTextareaHeight() {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            const lineHeight = 24
            const maxHeight = lineHeight * 6
            const newHeight = Math.min(textarea.scrollHeight, maxHeight)
            textarea.style.height = newHeight + 'px'
        }
    }

    function handleTextareaChange(ev) {
        setNewMessageText(ev.target.value)
        adjustTextareaHeight()
    }

    function handleKeyDown(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault()
            sendMessage(ev)
        }
    }
    
    function sendMessage(ev, file = null) {
        if (ev) ev.preventDefault();
        if (!newMessageText.trim() && !file) return;

        const message = {
            recipent: selectedUserId,
            text: newMessageText,
            file
        };

        console.log("Sending message:", message);
        ws.send(JSON.stringify(message));

        if (file) {
            axios.get("/messages/" + selectedUserId).then(res => {
                setMessages(res.data)
            })
        }
        else {
            setNewMessageText("");
            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: id,
                recipent: selectedUserId,
                _id: Date.now()
            }]));
        }

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }, 0)
    }
    
    function sendFile(ev) {
        const reader = new FileReader()
        reader.readAsDataURL(ev.target.files[0])
        reader.onload = () => {
            const fileData = {
                name: ev.target.files[0].name,
                data: reader.result
            };
            console.log("File data to be sent:", fileData);
            sendMessage(null, fileData);
        }
    }

    function handleChatSummarization() {
        if (!startTime || !endTime) {
            alert('Please select both start and end times.');
            return;
        }

        axios.post(`/summarize/${selectedUserId}`, { startTime, endTime })
            .then(res => {
                setSummarizationText(res.data.summary);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        const div = divUnderMessages.current
        if (div) {
            div.scrollIntoView({behavior: 'smooth', block: 'end'})
        }
    }, [messages])

    useEffect(() => {
        axios.get("/people").then(res => {
            const offlinePeopleArr = res.data.filter(p => p._id !== id && !Object.prototype.hasOwnProperty.call(onlinePeople, p._id))
            const offlinePeople = {}
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p
            })
            setOfflinePeople(offlinePeople)
        })
    }, [onlinePeople])

    useEffect(() => {
        if (selectedUserId) {
            axios.get("/messages/" + selectedUserId).then(res => {
                setMessages(res.data)
            })
            if (window.innerWidth < 768) {
                setShowSidebar(false)
            }
        }
    }, [selectedUserId])

    const onlinePeopleExcludingOurUser = {...onlinePeople}
    delete onlinePeopleExcludingOurUser[id]

    const messagesWithoutDubs = uniqBy(messages, '_id')

    return (
        <div className={`flex h-screen ${darkMode ? 'dark' : ''}`} style={{
            backgroundColor: darkMode ? 'oklch(0.1 0.1 264)' : 'oklch(0.92 0.1 264)',
            color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)'
        }}>
            <aside 
                className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-1/3 flex-col shadow-2xl absolute md:relative z-20 h-full`}
                style={{
                    backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(0.96 0.1 264)',
                    borderRight: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                }}
            >
                <div className="flex-grow overflow-y-auto messages-scroll">
                    <div className="sticky top-0 shadow-lg z-10" style={{
                        backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                        borderBottom: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                    }}>
                        <div className="flex items-center justify-between p-4">
                            <Logo />
                            <button
                                onClick={() => handleDarkModeToggle()}
                                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
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
                        </div>
                    </div>
                    <div className="p-3">
                        {Object.keys(onlinePeopleExcludingOurUser).map(userId => (
                            <Contact userId={userId} key={userId} online={true} username={onlinePeopleExcludingOurUser[userId]} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} darkMode={darkMode} />
                        ))}
                        {Object.keys(offlinePeople).map(userId => (
                            <Contact userId={userId} key={userId} online={false} username={offlinePeople[userId].username} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} darkMode={darkMode} />
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t shadow-inner" style={{
                    backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                    borderColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'
                }}>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{
                                background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="truncate max-w-[100px] md:max-w-[150px]">{username}</span>
                        </span>
                        <button 
                            className="text-xs md:text-sm font-medium py-2 px-3 md:px-4 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
                            onClick={logout}
                            style={{
                                backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                                color: 'oklch(0.7 0.2 30)',
                                border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                            }}
                        >Logout</button>
                    </div>
                </div>
            </aside>

            <main className={`${!showSidebar || selectedUserId ? 'flex' : 'hidden'} md:flex w-full md:w-2/3 p-2 md:p-4 flex-col`}>
                {selectedUserId && (
                    <div className="md:hidden flex items-center gap-3 mb-2 p-3 rounded-xl" style={{
                        backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(0.96 0.1 264)',
                        border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                    }}>
                        <button 
                            onClick={() => {
                                setShowSidebar(true)
                                setSelectedUserId(null)
                            }}
                            className="p-2 rounded-lg"
                            style={{
                                color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)'
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <span className="font-medium text-lg">
                            {onlinePeople[selectedUserId] || offlinePeople[selectedUserId]?.username || 'Chat'}
                        </span>
                    </div>
                )}

                <div className="flex-grow mb-2 md:mb-4 rounded-xl md:rounded-2xl shadow-xl overflow-hidden" style={{
                    backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(0.96 0.1 264)',
                    border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                }}>
                    {!selectedUserId && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center animate-pulse px-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4" style={{
                                    color: darkMode ? 'oklch(0.5 0.2 264)' : 'oklch(0.6 0.2 264)'
                                }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>
                                <p className="text-base md:text-lg font-medium" style={{
                                    color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                                }}>Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                    {!!selectedUserId && (
                       <div className="relative h-full flex flex-col">
                            <div className="sticky top-0 z-10 flex justify-end p-2 border-b" style={{
                                backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(0.96 0.1 264)',
                                borderColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'
                            }}>
                                <div className="mx-4 hover:bg-opacity-10 bg-inherit rounded-full p-1 flex items-center gap-1 text-xs md:text-sm cursor-pointer" onClick={() => {
                                    setShowPopup(true)
                                    // handleChatSummarization()
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto p-3 md:p-6 space-y-2 md:space-y-3 messages-scroll">
                                {messagesWithoutDubs.map((message, index) => (
                                    <div
                                        key={message._id}
                                        className={`flex animate-fadeIn ${message.sender === id ? 'justify-end' : 'justify-start'}`}
                                        style={{animationDelay: `${index * 0.05}s`}}
                                    >
                                        <div 
                                            className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-md whitespace-pre-wrap break-words transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                                message.sender === id ? 'rounded-br-sm' : 'rounded-bl-sm'
                                            }`}
                                            style={{
                                                backgroundColor: message.sender === id 
                                                    ? 'oklch(0.4 0.2 264)'
                                                    : darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                                                color: message.sender === id 
                                                    ? 'oklch(1 0.1 264)'
                                                    : darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                                                border: message.sender !== id ? `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}` : 'none'
                                            }}
                                        >
                                            <p className="text-sm leading-relaxed">
                                                {message.text}
                                                {message.file && (
                                                    <span className="mt-2">
                                                        <a className="border-b flex items-center gap-1 text-xs md:text-sm" href={`${axios.defaults.baseURL}/uploads/${message.file}`} target="_blank" rel="noopener noreferrer">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                                                            <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="truncate max-w-[150px] md:max-w-none">{message.file}</span>
                                                        </a>
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
                        </div>
                    )}
                </div>
                {!!selectedUserId && (
                    <form className="flex gap-2 md:gap-3 items-end" onSubmit={sendMessage}>
                        <div className="flex-grow relative">
                            <textarea 
                                ref={textareaRef}
                                value={newMessageText} 
                                onChange={handleTextareaChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..." 
                                className="w-full p-3 md:p-4 pr-24 md:pr-28 rounded-2xl resize-none overflow-y-auto shadow-lg transition-all duration-200 messages-scroll text-sm md:text-base" 
                                style={{
                                    backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                                    color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                                    border: `2px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.6 0.2 264)'}`,
                                    minHeight: '52px',
                                    maxHeight: '120px',
                                }}
                            />
                            <div className="absolute right-2 md:right-3 bottom-2 md:bottom-3 flex items-center gap-1.5 h-full pt-3">
                                <label 
                                    className="p-2 rounded-full transition-all cursor-pointer duration-200 hover:scale-110 active:scale-95 hover:bg-opacity-10"
                                    style={{
                                        color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)',
                                        backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(0.92 0.1 264)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                    }}
                                >
                                    <input type="file" className="hidden" onChange={sendFile} />
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z" clipRule="evenodd" />
                                    </svg>
                                </label>
                                <button 
                                    type="submit" 
                                    className="p-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg"
                                    style={{
                                        background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))',
                                        color: 'oklch(1 0.1 264)'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </main>

            {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 md:w-1/2" style={{
                        backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                        color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                    }}>
                        <h2 className="text-lg font-bold mb-4" style={{
                            color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)',
                        }}>Chat Summary</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{
                                color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                            }}>Start Time:</label>
                            <input 
                                type="datetime-local" 
                                className="w-full p-2 rounded border" 
                                style={{
                                    backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                                    color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                                    borderColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)',
                                }}
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2" style={{
                                color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                            }}>End Time:</label>
                            <input 
                                type="datetime-local" 
                                className="w-full p-2 rounded border" 
                                style={{
                                    backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                                    color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                                    borderColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)',
                                }}
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                        {loading ? (
                            <div className="space-y-2 mb-2">
                                <div className="h-4 rounded w-3/4 animate-pulse" style={{
                                    backgroundColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)',
                                }}></div>
                                <div className="h-4 rounded w-2/4 animate-pulse" style={{
                                    backgroundColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)',
                                }}></div>
                                <div className="h-4 rounded w-4/5 animate-pulse" style={{
                                    backgroundColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)',
                                }}></div>
                            </div>
                        ) : summarizationText ? (
                            <p className="text-sm mb-4" style={{
                                color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)',
                            }}>{summarizationText}</p>
                        ) : null}
                        <button 
                            className="px-4 py-2 rounded hover:bg-opacity-90" style={{
                                backgroundColor: darkMode ? 'oklch(0.4 0.2 264)' : 'oklch(0.76 0.2 264)',
                                color: 'oklch(1 0.1 264)',
                            }}
                            onClick={() => {
                                if (!startTime || !endTime) {
                                    alert('Please select both start and end times.');
                                    return;
                                }
                                setLoading(true);
                                handleChatSummarization();
                            }}
                        >
                            Start
                        </button>
                        <button 
                            className="px-4 py-2 rounded hover:bg-opacity-90 ml-2" style={{
                                backgroundColor: darkMode ? 'oklch(0.4 0.2 264)' : 'oklch(0.76 0.2 264)',
                                color: 'oklch(1 0.1 264)',
                            }}
                            onClick={() => setShowPopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

                .messages-scroll::-webkit-scrollbar,
                textarea::-webkit-scrollbar {
                    width: 6px;
                }

                .messages-scroll::-webkit-scrollbar-thumb,
                textarea::-webkit-scrollbar-thumb {
                    background-color: rgba(120, 120, 140, 0.35);
                    border-radius: 20px;
                    transition: background-color 0.2s ease;
                }

                .messages-scroll::-webkit-scrollbar-thumb:hover,
                textarea::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(120, 120, 140, 0.55);
                }

                .messages-scroll::-webkit-scrollbar-track,
                textarea::-webkit-scrollbar-track {
                    background: transparent;
                }

                .messages-scroll,
                textarea {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(120, 120, 140, 0.35) transparent;
                }

                :global(.dark) .messages-scroll::-webkit-scrollbar-thumb,
                :global(.dark) textarea::-webkit-scrollbar-thumb {
                    background-color: rgba(200, 200, 220, 0.35);
                }

                :global(.dark) .messages-scroll::-webkit-scrollbar-thumb:hover,
                :global(.dark) textarea::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(200, 200, 220, 0.55);
                }

                :global(.dark) .messages-scroll,
                :global(.dark) textarea {
                    scrollbar-color: rgba(200, 200, 220, 0.35) transparent;
                }

                @media (max-width: 768px) {
                    .messages-scroll::-webkit-scrollbar,
                    textarea::-webkit-scrollbar {
                        width: 4px;
                    }
                }
            `}</style>
        </div>
    )
}