import { useState, useEffect, memo, useMemo, useCallback } from 'react'
import axios from 'axios'
import { marked } from 'marked'
import './App.css'
import { getTranslation } from './translations'
import Auth from './Auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Мемоизированный компонент Sidebar чтобы избежать ре-рендера при печатании
const Sidebar = memo(({ 
  darkMode, 
  searchQuery, 
  setSearchQuery, 
  chatHistory, 
  currentChatId, 
  loadChat, 
  deleteChat, 
  newChat,
  codingMode,
  freedomMode,
  setCodingMode,
  setFreedomMode,
  language
}) => {
  const t = (key) => getTranslation(language, key);
  
  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">{codingMode ? '💻' : freedomMode ? '🔓' : '✨'}</span>
          <span className="logo-text">Flickers</span>
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '52%', 
            transform: 'translateY(-50%)',
            fontSize: '18px',
            opacity: 0.7,
            pointerEvents: 'none',
            zIndex: 10,
            color: '#8b5cf6'
          }}>🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <button className="new-chat-btn" onClick={newChat}>
        {t('newChat')}
      </button>
      
      <div className="chat-list">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
            onClick={() => loadChat(chat.id)}
          >
            <span className="chat-item-title">{chat.title}</span>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                deleteChat(chat.id)
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
})

Sidebar.displayName = 'Sidebar'

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)
  
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [reasoningText, setReasoningText] = useState('')
  const [showReasoning, setShowReasoning] = useState(true)
  const [isThinking, setIsThinking] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [selectedModel, setSelectedModel] = useState('Flickers AI 2.5 FAST')
  
  // Check auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUsername = localStorage.getItem('username')
    
    if (savedToken && savedUsername) {
      setToken(savedToken)
      setUsername(savedUsername)
      setIsAuthenticated(true)
    }
  }, [])
  
  const handleLogin = (newToken, newUsername) => {
    setToken(newToken)
    setUsername(newUsername)
    setIsAuthenticated(true)
  }
  
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Logout error:', err)
    }
    
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
    setIsAuthenticated(false)
    setMessages([])
    setChatHistory([])
    setCurrentChatId(null)
  }
  const [availableModels, setAvailableModels] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showSurprise, setShowSurprise] = useState(false)
  const [codingMode, setCodingMode] = useState(false)
  const [freedomMode, setFreedomMode] = useState(false)
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: '',
    streamSpeed: 'normal',
    language: 'ru'
  })

  // Translation helper
  const t = useCallback((key) => getTranslation(settings.language, key), [settings.language])

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Отключено для избежания ошибок
    };

    const handleMouseDown = () => {
      // Отключено для избежания ошибок
    };

    const handleMouseUp = () => {
      // Отключено для избежания ошибок
    };

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Автоматическое переключение модели в режиме кодинга
  useEffect(() => {
    if (codingMode) {
      setSelectedModel('Flickers AI 2.2 ULTRA CODING')
    } else if (freedomMode) {
      setSelectedModel('Flickers AI 2.0 ULTRA')
    } else {
      setSelectedModel('Flickers AI 2.5 FAST')
    }
  }, [codingMode, freedomMode])

  useEffect(() => {
    loadModels()
    if (isAuthenticated && token) {
      loadChatHistory()
    }
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) setDarkMode(savedTheme === 'dark')
    
    // Настройка marked для безопасного рендеринга
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false,
      smartLists: true,
      smartypants: true
    })
    
    // Переопределяем рендерер для HTML
    const renderer = new marked.Renderer()
    
    renderer.code = function(token) {
      // В новой версии marked передается объект token
      const code = token.text || token || '';
      const language = token.lang || '';
      
      // Проверяем что code это строка
      const codeStr = typeof code === 'string' ? code : String(code);
      
      // Экранируем HTML в блоках кода
      const escapedCode = codeStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
      
      // Возвращаем стандартный HTML для блока кода
      return `<pre><code class="language-${language}">${escapedCode}</code></pre>`
    }
    
    marked.setOptions({ renderer })
    
    const savedSettings = localStorage.getItem('flickers-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    // Добавляем кнопки копирования к блокам кода
    const addCopyButtons = () => {
      const copyText = t('copy');
      const copiedText = t('copied');
      
      document.querySelectorAll('pre:not(.has-copy-btn)').forEach((pre) => {
        const code = pre.querySelector('code')
        if (!code) return
        
        pre.classList.add('has-copy-btn')
        
        const button = document.createElement('button')
        button.className = 'copy-code-btn'
        button.innerHTML = `📋 ${copyText}`
        button.title = copyText
        
        button.onclick = (e) => {
          e.preventDefault()
          e.stopPropagation()
          navigator.clipboard.writeText(code.textContent)
          button.innerHTML = `✓ ${copiedText}`
          button.style.background = '#10b981'
          setTimeout(() => {
            button.innerHTML = `📋 ${copyText}`
            button.style.background = ''
          }, 2000)
        }
        
        pre.appendChild(button)
      })
    }
    
    // Запускаем сразу и через интервалы
    setTimeout(addCopyButtons, 100)
    const interval = setInterval(addCopyButtons, 1000)
    return () => clearInterval(interval)
  }, [messages, streamingMessage, t])

  const loadModels = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/models`)
      setAvailableModels(response.data.models)
    } catch (error) {
      console.error('Error loading models:', error)
    }
  }

  const loadChatHistory = async () => {
    if (!token) return
    
    try {
      const response = await axios.get(`${API_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setChatHistory(response.data.chats)
    } catch (error) {
      console.error('Error loading chat history:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const loadChat = useCallback(async (chatId) => {
    if (!token) return
    
    try {
      const response = await axios.get(`${API_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessages(response.data.messages)
      setSelectedModel(response.data.model)
      setCurrentChatId(chatId)
      
      // Закрываем sidebar на мобильных после выбора чата
      if (window.innerWidth <= 768) {
        setShowSidebar(false)
      }
    } catch (error) {
      console.error('Error loading chat:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }, [])

  const saveChat = async () => {
    if (messages.length === 0 || !token) return

    let title = messages[0]?.content.substring(0, 50) || 'Новый чат'
    const chatId = currentChatId || new Date().getTime().toString()

    // Если это первое сохранение (нет currentChatId) и есть хотя бы одно сообщение,
    // генерируем умное название
    if (!currentChatId && messages.length >= 1) {
      try {
        const response = await axios.post(`${API_URL}/api/generate-title`, {
          message: messages[0].content
        })
        if (response.data.title) {
          title = response.data.title
        }
      } catch (error) {
        console.error('Error generating title:', error)
        // Используем первые слова сообщения как fallback
        title = messages[0].content.substring(0, 50)
      }
    }

    try {
      await axios.post(`${API_URL}/api/chats/save`, {
        chat_id: chatId,
        title,
        messages,
        model: selectedModel
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCurrentChatId(chatId)
      loadChatHistory()
    } catch (error) {
      console.error('Error saving chat:', error)
      if (error.response?.status === 401) {
        handleLogout()
      }
    }
  }

  const deleteChat = useCallback(async (chatId) => {
    if (!token) return
    
    try {
      await axios.delete(`${API_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      loadChatHistory()
      if (currentChatId === chatId) {
        newChat()
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }, [currentChatId])

  const newChat = useCallback(() => {
    console.log('🆕 Новый чат создан')
    
    // Принудительно очищаем всё
    setMessages([])
    setCurrentChatId(null)
    setStreamingMessage('')
    setReasoningText('')
    setInput('')
    
    // Закрываем sidebar на мобильных после создания нового чата
    if (window.innerWidth <= 768) {
      setShowSidebar(false)
    }
    
    // Добавляем небольшую задержку для визуального эффекта
    setTimeout(() => {
      console.log('✅ Чат очищен, messages.length:', 0)
    }, 100)
  }, [])

  const copyMessage = (content, index) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const regenerateResponse = async () => {
    if (messages.length < 2) return
    
    // Удаляем последний ответ AI
    const newMessages = messages.slice(0, -1)
    setMessages(newMessages)
    
    // Отправляем запрос заново
    const lastUserMessage = newMessages[newMessages.length - 1]
    setInput(lastUserMessage.content)
    setTimeout(() => sendMessage(), 100)
  }

  const exportChat = (format = 'txt') => {
    if (messages.length === 0) return
    
    let content = ''
    const timestamp = new Date().toLocaleString('ru-RU')
    
    if (format === 'txt') {
      content = `Flickers AI - Экспорт чата\nДата: ${timestamp}\nМодель: ${selectedModel}\n\n`
      messages.forEach(msg => {
        const role = msg.role === 'user' ? 'Вы' : 'Flickers'
        content += `${role}:\n${msg.content}\n\n`
      })
    } else if (format === 'json') {
      content = JSON.stringify({
        timestamp,
        model: selectedModel,
        messages
      }, null, 2)
    }
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flickers-chat-${Date.now()}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredChats = useMemo(() => 
    chatHistory.filter(chat =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    ), [chatHistory, searchQuery]
  )

  const sendMessage = async () => {
    if (!input.trim()) return

    console.log('🚀 Отправка сообщения, codingMode:', codingMode, 'freedomMode:', freedomMode)

    const userMessage = { 
      role: 'user', 
      content: input,
      codingMode: codingMode,
      freedomMode: freedomMode
    }
    
    console.log('📤 User message:', userMessage)
    
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setThinking(true)
    setIsThinking(true)
    setStreamingMessage('')
    setReasoningText('')

    try {
      const requestBody = {
        messages: newMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model: selectedModel,
        chat_id: currentChatId,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        system_prompt: settings.systemPrompt,
        stream_speed: settings.streamSpeed,
        coding_mode: codingMode,
        freedom_mode: freedomMode
      }

      console.log('⚙️ Отправляем с настройками:', {
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        stream_speed: settings.streamSpeed,
        has_system_prompt: !!settings.systemPrompt
      })

      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Ошибка API')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullMessage = ''
      
      setThinking(false)
      
      console.log('🔵 Начинаем читать стрим...')
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('✅ Стрим завершен')
          break
        }
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              console.log('✅ Получен [DONE]')
              continue
            }
            
            try {
              const parsed = JSON.parse(data)
              console.log('📦 Получен чанк:', parsed)
              
              // Обработка ошибок
              if (parsed.error) {
                console.error('❌ Ошибка от API:', parsed.error)
                throw new Error(parsed.error)
              }
              
              // Обработка reasoning (процесс мышления)
              if (parsed.reasoning) {
                setReasoningText(prev => prev + parsed.reasoning)
                setThinking(false)
                setIsThinking(true)
              }
              
              // Обработка основного контента
              if (parsed.content) {
                fullMessage += parsed.content
                setStreamingMessage(fullMessage)
                setThinking(false)
                setIsThinking(false)
              }
              
              if (parsed.chat_id && !currentChatId) {
                setCurrentChatId(parsed.chat_id)
              }
            } catch (e) {
              console.error('⚠️ Ошибка парсинга чанка:', e, 'Данные:', data)
            }
          }
        }
      }
      
      console.log('📝 Полное сообщение:', fullMessage)

      console.log('📝 Полное сообщение:', fullMessage)

      if (!fullMessage || fullMessage.trim() === '') {
        console.error('❌ Получено пустое сообщение!')
        throw new Error('AI вернул пустой ответ. Попробуйте другую модель или перефразируйте вопрос.')
      }

      const assistantMessage = {
        role: 'assistant',
        content: fullMessage,
        reasoning: reasoningText,
        codingMode: codingMode,
        freedomMode: freedomMode
      }
      
      console.log('📥 Assistant message:', assistantMessage)
      
      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessage('')
      setReasoningText('')
      setIsThinking(false)
      
      // НЕ сохраняем чат в режиме "Свобода мыслей"
      if (!freedomMode) {
        setTimeout(saveChat, 500)
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMsg = error.message || 'Ошибка при отправке сообщения'
      alert(errorMsg)
      setMessages(messages)
    } finally {
      setLoading(false)
      setThinking(false)
      setIsThinking(false)
    }
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} language={settings.language} />
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'} ${showSidebar ? 'sidebar-open' : ''} ${codingMode ? 'coding-mode' : ''} ${freedomMode ? 'freedom-mode' : ''}`}>
      <div className="cursor-follower" />
      <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
      {showSidebar && !freedomMode && (
        <Sidebar
          darkMode={darkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          chatHistory={filteredChats}
          currentChatId={currentChatId}
          loadChat={loadChat}
          deleteChat={deleteChat}
          newChat={newChat}
          codingMode={codingMode}
          freedomMode={freedomMode}
          setCodingMode={setCodingMode}
          setFreedomMode={setFreedomMode}
          language={settings.language}
        />
      )}

      <div className="main-content">
        <div className="chat-container">
          <div className="header">
            <button className="toggle-sidebar" onClick={() => setShowSidebar(!showSidebar)}>
              ☰
            </button>
            <h1>
              Flickers AI
              {isThinking && <span className="thinking-badge">{t('thinking')}</span>}
            </h1>
            <div className="header-controls">
              {!codingMode && !freedomMode && (
                <>
                  <button 
                    className="coding-mode-btn" 
                    onClick={() => setCodingMode(true)}
                    title={t('codingModeTitle')}
                  >
                    {t('codingMode')}
                  </button>
                  <button 
                    className="freedom-mode-btn" 
                    onClick={() => setFreedomMode(true)}
                    title={t('freedomModeTitle')}
                  >
                    {t('freedomMode')}
                  </button>
                </>
              )}
              {codingMode && (
                <>
                  <div className="coding-mode-indicator">
                    {t('codingModeIndicator')}
                  </div>
                  <button 
                    className="exit-coding-btn" 
                    onClick={() => setCodingMode(false)}
                    title={t('exitMode')}
                  >
                    {t('exitMode')}
                  </button>
                </>
              )}
              {freedomMode && (
                <>
                  <div className="freedom-mode-indicator">
                    {t('freedomModeIndicator')}
                  </div>
                  <button 
                    className="exit-freedom-btn" 
                    onClick={() => {
                      setFreedomMode(false)
                      setMessages([])
                    }}
                    title={t('exitMode')}
                  >
                    {t('exitMode')}
                  </button>
                </>
              )}
              <button className="settings-btn" onClick={() => setShowSettings(!showSettings)} title={t('settings')}>
                ⚙️
                {(settings.temperature !== 0.7 || settings.maxTokens !== 2000 || settings.systemPrompt || settings.streamSpeed !== 'normal') && (
                  <span className="settings-active-dot"></span>
                )}
              </button>
              <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button className="logout-btn" onClick={handleLogout} title={t('logout')}>
                👤 {username}
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="settings-panel">
              <div className="settings-overlay" onClick={() => setShowSettings(false)}></div>
              <div className="settings-content">
                <div className="settings-header">
                  <h2>{t('settingsTitle')}</h2>
                  <button className="close-settings" onClick={() => setShowSettings(false)}>×</button>
                </div>
                
                <div className="settings-body">
                  {/* Информация о текущих настройках */}
                  <div className="settings-info-panel">
                    <div className="settings-info-title">{t('settingsInfoTitle')}</div>
                    <div className="settings-info-grid">
                      <div className="settings-info-item">
                        <span className="info-icon">🌡️</span>
                        <span className="info-label">{t('temperature')}:</span>
                        <span className="info-value">{settings.temperature}</span>
                      </div>
                      <div className="settings-info-item">
                        <span className="info-icon">📏</span>
                        <span className="info-label">{t('tokens')}:</span>
                        <span className="info-value">{settings.maxTokens}</span>
                      </div>
                      <div className="settings-info-item">
                        <span className="info-icon">⚡</span>
                        <span className="info-label">{t('speed')}:</span>
                        <span className="info-value">
                          {settings.streamSpeed === 'slow' ? t('speedSlow') : settings.streamSpeed === 'normal' ? t('speedNormal') : t('speedFast')}
                        </span>
                      </div>
                      <div className="settings-info-item">
                        <span className="info-icon">💬</span>
                        <span className="info-label">{t('prompt')}:</span>
                        <span className="info-value">
                          {settings.systemPrompt ? `${settings.systemPrompt.length} ${t('symbols')}` : t('notSet')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="setting-group">
                    <label>
                      <span className="setting-label">{t('temperatureLabel')}</span>
                      <span className="setting-value">{settings.temperature}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                      className="slider"
                    />
                    <p className="setting-description">{t('temperatureDesc')}</p>
                  </div>

                  <div className="setting-group">
                    <label>
                      <span className="setting-label">{t('maxTokensLabel')}</span>
                      <span className="setting-value">{settings.maxTokens}</span>
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={settings.maxTokens}
                      onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
                      className="slider"
                    />
                    <p className="setting-description">{t('maxTokensDesc')}</p>
                  </div>

                  <div className="setting-group">
                    <label>
                      <span className="setting-label">{t('streamSpeedLabel')}</span>
                      <span className="setting-value">{settings.streamSpeed === 'slow' ? t('speedSlow') : settings.streamSpeed === 'normal' ? t('speedNormal') : t('speedFast')}</span>
                    </label>
                    <select
                      value={settings.streamSpeed}
                      onChange={(e) => setSettings({...settings, streamSpeed: e.target.value})}
                      className="setting-select"
                    >
                      <option value="slow">{t('speedSlow')}</option>
                      <option value="normal">{t('speedNormal')}</option>
                      <option value="fast">{t('speedFast')}</option>
                    </select>
                    <p className="setting-description">{t('streamSpeedDesc')}</p>
                  </div>

                  <div className="setting-group">
                    <label>
                      <span className="setting-label">{t('languageLabel')}</span>
                      <span className="setting-value">{settings.language === 'ru' ? t('languageRu') : t('languageEn')}</span>
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                      className="setting-select"
                    >
                      <option value="ru">{t('languageRu')}</option>
                      <option value="en">{t('languageEn')}</option>
                    </select>
                    <p className="setting-description">{t('languageDesc')}</p>
                  </div>

                  <div className="setting-group">
                    <label>
                      <span className="setting-label">{t('systemPromptLabel')}</span>
                    </label>
                    <textarea
                      value={settings.systemPrompt}
                      onChange={(e) => setSettings({...settings, systemPrompt: e.target.value})}
                      placeholder={t('systemPromptPlaceholder')}
                      className="system-prompt-input"
                      rows="4"
                    />
                    <p className="setting-description">{t('systemPromptDesc')}</p>
                  </div>

                  <div className="settings-footer">
                    <button className="reset-btn" onClick={() => setSettings({
                      temperature: 0.7,
                      maxTokens: 2000,
                      systemPrompt: '',
                      streamSpeed: 'normal',
                      language: 'ru'
                    })}>
                      {t('resetBtn')}
                    </button>
                    <button className="save-btn" onClick={() => {
                      localStorage.setItem('flickers-settings', JSON.stringify(settings))
                      setShowSettings(false)
                    }}>
                      {t('saveBtn')}
                    </button>
                  </div>
                  <div className="easter-egg">Willine AI, соси!</div>
                </div>
              </div>
            </div>
          )}

          {showSurprise && (
            <div className="surprise-modal">
              <div className="surprise-overlay" onClick={() => setShowSurprise(false)}></div>
              <div className="surprise-content">
                <button className="close-surprise" onClick={() => setShowSurprise(false)}>×</button>
                <div className="fire-text">
                  {t('surpriseText')}
                </div>
              </div>
            </div>
          )}

          <div className="messages">
            {messages.length === 0 && !codingMode && !freedomMode && (
              <div className="welcome">
                <h2>{t('welcomeTitle')}</h2>
                <p><span className="rainbow-word">{t('welcomeAll')}</span> {t('welcomeSubtitle')}</p>
                
                <div className="welcome-model-selector">
                  <label>{t('selectModel')}</label>
                  <select 
                    value={selectedModel} 
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="model-select"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <button 
                  className="welcome-surprise-btn" 
                  onClick={() => setShowSurprise(true)}
                >
                  {t('surpriseBtn')}
                </button>
              </div>
            )}
            {messages.length === 0 && codingMode && (
              <div className="welcome coding-welcome">
                <div className="coding-logo">
                  <span className="coding-icon">💻</span>
                  <h2 className="typing-animation">{t('codingWelcomeTitle')}</h2>
                </div>
                <p className="coding-subtitle">{t('codingWelcomeSubtitle')}</p>
                <div className="coding-features">
                  <div className="coding-feature">
                    <span>⚡</span>
                    <span>{t('codingFeature1')}</span>
                  </div>
                  <div className="coding-feature">
                    <span>🎯</span>
                    <span>{t('codingFeature2')}</span>
                  </div>
                  <div className="coding-feature">
                    <span>🔒</span>
                    <span>{t('codingFeature3')}</span>
                  </div>
                </div>
                <div className="coding-hint">
                  {t('codingHint')}
                </div>
              </div>
            )}
            {messages.length === 0 && freedomMode && (
              <div className="welcome freedom-welcome">
                <div className="freedom-logo">
                  <span className="freedom-icon">🔓</span>
                  <h2>{t('freedomWelcomeTitle')}</h2>
                </div>
                <p className="freedom-subtitle">{t('freedomWelcomeSubtitle')}</p>
                <div className="freedom-features">
                  <div className="freedom-feature">
                    <span>🗣️</span>
                    <span>{t('freedomFeature1')}</span>
                  </div>
                  <div className="freedom-feature">
                    <span>🔒</span>
                    <span>{t('freedomFeature2')}</span>
                  </div>
                  <div className="freedom-feature">
                    <span>⚡</span>
                    <span>{t('freedomFeature3')}</span>
                  </div>
                  <div className="freedom-feature">
                    <span>🎭</span>
                    <span>{t('freedomFeature4')}</span>
                  </div>
                </div>
                <div className="freedom-warning">
                  {t('freedomWarning')}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => {
              console.log(`Message ${idx}: codingMode=${msg.codingMode}, role=${msg.role}`)
              const messageClasses = `message ${msg.role} ${msg.codingMode ? 'coding-mode-message' : ''}`
              console.log(`Message ${idx} classes:`, messageClasses)
              
              // Проверяем, изменился ли режим кодинга по сравнению с предыдущим сообщением
              const prevMsg = idx > 0 ? messages[idx - 1] : null
              const modeChanged = prevMsg && prevMsg.codingMode !== msg.codingMode
              
              return (
              <div key={idx}>
                {modeChanged && (
                  <div className={`mode-separator ${msg.codingMode ? 'coding-mode-start' : 'normal-mode-start'}`}>
                    <div className="mode-separator-line"></div>
                    <div className="mode-separator-badge">
                      {msg.codingMode ? (
                        <>
                          <span className="mode-icon">💻</span>
                          <span className="mode-text">{t('codingModeActivated')}</span>
                        </>
                      ) : (
                        <>
                          <span className="mode-icon">✨</span>
                          <span className="mode-text">{t('normalMode')}</span>
                        </>
                      )}
                    </div>
                    <div className="mode-separator-line"></div>
                  </div>
                )}
              <div className={messageClasses} data-coding-mode={msg.codingMode ? 'true' : 'false'}>
                <div className="message-content">
                  <div className="message-header">
                    <div className="message-label">{msg.role === 'user' ? t('you') : t('flickers')}</div>
                    <div className="message-actions">
                      <button 
                        className="action-btn"
                        onClick={() => copyMessage(msg.content, idx)}
                        title={t('copy')}
                      >
                        {copiedIndex === idx ? '✓' : '📋'}
                      </button>
                      {msg.role === 'assistant' && idx === messages.length - 1 && (
                        <button 
                          className="action-btn"
                          onClick={regenerateResponse}
                          title="Регенерировать"
                        >
                          🔄
                        </button>
                      )}
                    </div>
                  </div>
                  {msg.reasoning && showReasoning && (
                    <details className="reasoning-block">
                      <summary className="reasoning-summary">
                        <span className="reasoning-icon">💭</span>
                        <span>Процесс размышления</span>
                        <span className="reasoning-badge">Завершено</span>
                      </summary>
                      <div 
                        className="reasoning-text"
                        dangerouslySetInnerHTML={{ __html: marked(msg.reasoning) }}
                      />
                    </details>
                  )}
                  {msg.image && (
                    <img src={msg.image} alt="Uploaded" className="message-image" />
                  )}
                  <div 
                    className="message-text"
                    dangerouslySetInnerHTML={{ __html: marked(msg.content) }}
                  />
                </div>
              </div>
              </div>
              )
            })}
            {thinking && (
              <div className={`message assistant ${codingMode ? 'coding-mode-message' : ''}`}>
                <div className="message-content">
                  <div className="message-label">Flickers</div>
                  <div className="thinking-indicator">
                    <div className="thinking-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="thinking-text">Думаю...</span>
                  </div>
                </div>
              </div>
            )}
            {(reasoningText || streamingMessage) && (
              <div className={`message assistant ${codingMode ? 'coding-mode-message' : ''}`}>
                <div className="message-content">
                  <div className="message-label">Flickers</div>
                  {reasoningText && showReasoning && (
                    <details className="reasoning-block" open>
                      <summary className="reasoning-summary">
                        <span className="reasoning-icon">💭</span>
                        <span>Процесс размышления</span>
                        <span className="reasoning-badge">Думаю...</span>
                      </summary>
                      <div 
                        className="reasoning-text streaming"
                        dangerouslySetInnerHTML={{ __html: marked(reasoningText) + '<span class="cursor">▋</span>' }}
                      />
                    </details>
                  )}
                  {streamingMessage && (
                    <div 
                      className="message-text streaming"
                      dangerouslySetInnerHTML={{ __html: marked(streamingMessage) + '<span class="cursor">▋</span>' }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="input-area">
            <div className="input-wrapper">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={codingMode ? t('inputPlaceholderCoding') : freedomMode ? t('inputPlaceholderFreedom') : t('inputPlaceholder')}
                disabled={loading}
              />
            </div>
            <button className="send-button" onClick={sendMessage} disabled={loading}>
              {loading ? '⏳' : '→'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
