import { useState, useRef, useEffect } from 'react';
import { MdSend, MdSmartToy, MdPerson, MdAutoAwesome } from 'react-icons/md';
import './Management.css';

const QUICK_PROMPTS = [
  '📚 Recommend a learning path for React',
  '📝 Generate MCQ questions for Python basics',
  '📊 Summarize student performance metrics',
  '💡 Ideas for a full stack project',
  '🎯 Create a study schedule for next week',
  '🤖 Explain REST API concepts simply',
];

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: "Hi! I'm your **AI Learning Assistant** 🤖\n\nI can help you with:\n- Course recommendations\n- Study plans\n- Quiz generation\n- Code explanations\n- Assignment ideas\n\nWhat would you like help with today?",
  }
];

const AIAssistantPage = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with real API call)
    await new Promise(r => setTimeout(r, 1200));
    const responses = {
      default: "That's a great question! Here are some key points to consider:\n\n1. **Start with the fundamentals** – always build a solid foundation first\n2. **Practice consistently** – coding is a skill that improves with repetition\n3. **Build real projects** – apply what you learn to actual problems\n4. **Join a community** – collaborate and learn from others\n\nWould you like me to go deeper on any of these points?",
    };
    const aiText = responses[text.toLowerCase()] || responses.default;
    setMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
    setLoading(false);
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="page-section" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 110px)' }}>
      {/* Header */}
      <div className="mgmt-header" style={{ marginBottom: 16 }}>
        <div className="mgmt-title-block">
          <h2>AI Learning Assistant</h2>
          <p>Your smart companion powered by AI – ask anything!</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-success" style={{ animation: 'pulse-glow 2s infinite' }}>
            ● Online
          </span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            className="btn btn-secondary btn-sm"
            onClick={() => sendMessage(p)}
            style={{ fontSize: '0.78rem' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--brand-gradient)' : 'linear-gradient(135deg, #a78bfa, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1rem',
              }}>
                {msg.role === 'user' ? <MdPerson /> : <MdSmartToy />}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: msg.role === 'user' ? 'var(--brand-gradient)' : 'var(--bg-surface-hover)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                animation: 'fadeInUp 0.3s ease',
              }}
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
              />
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #a78bfa, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1rem',
              }}>
                <MdSmartToy />
              </div>
              <div style={{
                padding: '14px 18px',
                borderRadius: '4px 18px 18px 18px',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-color)',
                display: 'flex', gap: 5, alignItems: 'center'
              }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-primary)',
                    animation: `pulse-glow 1.2s ${delay}s infinite`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: 10,
        }}>
          <input
            id="ai-chat-input"
            className="input"
            style={{ flex: 1, borderRadius: 'var(--radius-full)', padding: '10px 18px' }}
            placeholder="Ask me anything about learning, courses, or code..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          />
          <button
            id="ai-send-btn"
            className="btn btn-primary"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 18px' }}
          >
            <MdSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
