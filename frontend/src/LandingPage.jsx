import { useState } from 'react'
import Routes from './Routes'

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [showRoutes, setShowRoutes] = useState(false)
  function handleClick() {
    setShowRoutes(true)
  } 
  const features = [
    {
      title: "Real-Time Messaging",
      description: "Instant message delivery with WebSocket technology. Chat with your friends and colleagues in real-time.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      )
    },
    {
      title: "File Sharing",
      description: "Share documents, images, and files seamlessly. Support for multiple file formats with secure storage.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
      )
    },
    {
      title: "AI-Powered Summaries",
      description: "Get intelligent chat summaries powered by AI. Quickly review long conversations with key points extraction.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
    },
    {
      title: "Dark Mode",
      description: "Beautiful dark mode support for comfortable chatting at any time. Seamless theme switching with your preference saved.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )
    }
  ]
  if (showRoutes) {
    return <Routes />
  } else {
    return (
        <div className={darkMode ? 'dark' : ''} style={{
        backgroundColor: darkMode ? 'oklch(0.1 0.1 264)' : 'oklch(0.96 0.1 264)',
        minHeight: '100vh'
        }}>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{
            backgroundColor: darkMode ? 'oklch(0.15 0.1 264 / 0.8)' : 'oklch(1 0.1 264 / 0.8)',
            borderBottom: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                    </svg>
                </div>
                <span className="text-2xl font-bold" style={{
                    background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Chat App
                </span>
                </div>
                <div className="flex items-center gap-4">
                <button
                    onClick={() => setDarkMode(!darkMode)}
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
            </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{
                color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)'
                }}>
                Chat Smarter, <span style={{
                    background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Connect Better</span>
                </h1>
                <p className="text-xl md:text-2xl leading-relaxed" style={{
                color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                }}>
                Experience real-time messaging with AI-powered features. Share files, get instant summaries, and stay connected with everyone that matters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                <a
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl text-center"
                    style={{
                    background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))',
                    color: 'oklch(1 0.1 264)'
                    }}
                    onClick={handleClick}
                >
                    Start Chatting Now
                </a>
                <a
                    href="#features"
                    className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 text-center"
                    style={{
                    backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
                    color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)',
                    border: `2px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                    }}
                >
                    Learn More
                </a>
                </div>
                <div className="flex items-center gap-8 pt-8">
                <div>
                    <div className="text-3xl font-bold" style={{
                    color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)'
                    }}>10K+</div>
                    <div className="text-sm" style={{
                    color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                    }}>Active Users</div>
                </div>
                <div>
                    <div className="text-3xl font-bold" style={{
                    color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)'
                    }}>1M+</div>
                    <div className="text-sm" style={{
                    color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                    }}>Messages Sent</div>
                </div>
                <div>
                    <div className="text-3xl font-bold" style={{
                    color: darkMode ? 'oklch(0.76 0.2 264)' : 'oklch(0.4 0.2 264)'
                    }}>99.9%</div>
                    <div className="text-sm" style={{
                    color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                    }}>Uptime</div>
                </div>
                </div>
            </div>
            
            {/* Hero Images Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300" style={{
                    backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                    border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                }}>
                    <div className="p-6 h-48 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="oklch(0.4 0.2 264)" className="w-20 h-20">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                    </svg>
                    </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300" style={{
                    backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                    border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                }}>
                    <div className="p-6 h-64 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="oklch(0.76 0.2 264)" className="w-24 h-24">
                        <path fillRule="evenodd" d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z" clipRule="evenodd" />
                    </svg>
                    </div>
                </div>
                </div>
                <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300" style={{
                    backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                    border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                }}>
                    <div className="p-6 h-64 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="oklch(0.5 0.2 160)" className="w-24 h-24">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                    </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300" style={{
                    backgroundColor: darkMode ? 'oklch(0.2 0.1 264)' : 'oklch(1 0.1 264)',
                    border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                }}>
                    <div className="p-6 h-48 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="oklch(0.7 0.2 100)" className="w-20 h-20">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20" style={{
            backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)'
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
                color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)'
                }}>
                Powerful Features
                </h2>
                <p className="text-xl" style={{
                color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                }}>
                Everything you need for modern communication
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                <div
                    key={index}
                    className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    style={{
                    backgroundColor: darkMode ? 'oklch(0.1 0.1 264)' : 'oklch(0.96 0.1 264)',
                    border: `1px solid ${darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)'}`
                    }}
                >
                    <div className="mb-4" style={{ color: 'oklch(0.76 0.2 264)' }}>
                    {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{
                    color: darkMode ? 'oklch(0.96 0.1 264)' : 'oklch(0.15 0.2 264)'
                    }}>
                    {feature.title}
                    </h3>
                    <p style={{
                    color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
                    }}>
                    {feature.description}
                    </p>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-3xl p-12 shadow-2xl" style={{
                background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))'
            }}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Start Chatting?
                </h2>
                <p className="text-xl mb-8 text-white opacity-90">
                Join thousands of users already enjoying seamless communication
                </p>
                <a
                className="inline-block px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                style={{
                    backgroundColor: 'white',
                    color: 'oklch(0.4 0.2 264)'
                }}
                onClick={handleClick}
                >
                Get Started Free
                </a>
            </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t" style={{
            backgroundColor: darkMode ? 'oklch(0.15 0.1 264)' : 'oklch(1 0.1 264)',
            borderColor: darkMode ? 'oklch(0.3 0.2 264)' : 'oklch(0.7 0.2 264)',
            color: darkMode ? 'oklch(0.76 0.1 264)' : 'oklch(0.4 0.2 264)'
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))'
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                    </svg>
                </div>
                <span className="text-xl font-bold" style={{
                    background: 'linear-gradient(135deg, oklch(0.4 0.2 264), oklch(0.76 0.2 264))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Chat App
                </span>
                </div>
                <p className="mb-4">Modern messaging for modern teams</p>
                <p className="text-sm">© 2025 Chat App. All rights reserved.</p>
            </div>
            </div>
        </footer>
        </div>
    )
  }
}