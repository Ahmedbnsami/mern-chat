import Avatar from "./Avatar"

export default function Contact({userId, online, username, selectedUserId, setSelectedUserId, darkMode}) {
    const isSelected = userId === selectedUserId
    console.log('Contact rendered', userId, 'selected?', selectedUserId)
    return (
        <div 
            key={userId} 
            onClick={() => setSelectedUserId(userId)} 
            className="py-2 pl-4 items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] flex justify-between align-center"
            style={{
                borderBottom: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`,
                backgroundColor: isSelected 
                    ? (darkMode ? 'oklch(0.18 0.1 264)' : 'oklch(1 0.1 264)')
                    : 'transparent',
                borderLeft: isSelected ? `4px solid oklch(0.76 0.2 264)` : '4px solid transparent',
                color: darkMode ? 'oklch(0.85 0.1 264)' : 'oklch(0.15 0.2 264)'
            }}
        >
            <div className="flex items-center gap-3">
                <Avatar online={online} username={username} userId={userId} />
                <span 
                    className="font-medium" 
                    style={{
                        color: darkMode ? 'oklch(0.85 0.1 264)' : 'oklch(0.15 0.2 264)'
                    }}
                >
                    {username}
                </span> 
            </div>    
        </div>
    )
}