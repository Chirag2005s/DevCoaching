import { useEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import "./ChatWidget.css";

// ── Bot conversation flow ────────────────────────────────────────────────────

const MAIN_MENU = [
    { label: "📚 Our Courses", value: "courses" },
    { label: "💰 Fees & Pricing", value: "fees" },
    { label: "📅 Class Schedule", value: "schedule" },
    { label: "👨‍💻 Meet the Teacher", value: "teacher" },
    { label: "✅ How to Enroll", value: "enroll" },
    { label: "📞 Contact Us", value: "contact" },
];

const COURSE_MENU = [
    { label: "🐍 Python Track", value: "python" },
    { label: "⚛️ React + JS", value: "react" },
    { label: "🚀 Full-Stack MERN", value: "mern" },
    { label: "⬅️ Back to Menu", value: "menu" },
];

const BOT_FLOWS = {
    menu: {
        botText: "👋 Hi! I'm the **Dev Coaching AI Assistant**.\n\nChoose an option below, or just type your question!",
        options: MAIN_MENU,
    },
    courses: {
        botText: "📚 We offer **3 live coding tracks** taught by senior mentors on Google Meet:\n\n• 🐍 Python (fundamentals, Flask, data science)\n• ⚛️ React + JavaScript (frontend & SPAs)\n• 🚀 Full-Stack MERN (complete web development)\n\nWhich course interests you?",
        options: COURSE_MENU,
    },
    python: {
        botText: "🐍 **Python Track** covers:\n• Python fundamentals & OOP\n• Flask web development\n• Pandas & NumPy for data\n• File handling, APIs & automation\n• Real-world projects + exam papers\n\n✅ Live on Google Meet. Recordings included!",
        options: [
            { label: "💰 Python Fees", value: "fees" },
            { label: "✅ Enroll Now", value: "enroll" },
            { label: "⬅️ View All Courses", value: "courses" },
        ],
    },
    react: {
        botText: "⚛️ **React + JavaScript** covers:\n• JS fundamentals & ES6+\n• React components, hooks & routing\n• Context API & state management\n• Full MERN stack project builds\n\n✅ Live on Google Meet. Recordings included!",
        options: [
            { label: "💰 React Course Fees", value: "fees" },
            { label: "✅ Enroll Now", value: "enroll" },
            { label: "⬅️ View All Courses", value: "courses" },
        ],
    },
    mern: {
        botText: "🚀 **Full-Stack MERN** covers:\n• Node.js & Express backend APIs\n• MongoDB database design\n• React frontend + full integration\n• Complete project deployment\n\n✅ Our most comprehensive course!",
        options: [
            { label: "💰 MERN Course Fees", value: "fees" },
            { label: "✅ Enroll Now", value: "enroll" },
            { label: "⬅️ View All Courses", value: "courses" },
        ],
    },
    fees: {
        botText: "💰 **Pricing at Dev Coaching:**\n\n• 🆓 Free trial classes available for all courses\n• 💳 Paid courses at affordable prices\n• 📄 Includes live sessions, recordings & exam papers\n\nVisit the **Course** page for exact batch pricing, or contact the teacher directly!",
        options: [
            { label: "✅ How to Enroll", value: "enroll" },
            { label: "📞 Contact Teacher", value: "contact" },
            { label: "⬅️ Back to Menu", value: "menu" },
        ],
    },
    schedule: {
        botText: "📅 **Class Schedule:**\n\n• All sessions are **live on Google Meet**\n• Batch timings are shared after enrollment\n• Recorded sessions available to rewatch anytime\n• Ask doubts directly during live class\n\nNew batches start regularly — enroll to get your slot!",
        options: [
            { label: "✅ How to Enroll", value: "enroll" },
            { label: "📞 Contact Teacher", value: "contact" },
            { label: "⬅️ Back to Menu", value: "menu" },
        ],
    },
    teacher: {
        botText: "👨‍💻 **Johan Gao** — Senior Python Teacher\n\n⭐ Rating: 4.5 / 5\n🎓 Qualification: BCA\n💼 Experience: 8+ years\n✅ Status: Active\n\nPassionate educator dedicated to student growth and real-world coding skills.",
        options: [
            { label: "📞 Contact Johan", value: "contact" },
            { label: "📚 View Courses", value: "courses" },
            { label: "⬅️ Back to Menu", value: "menu" },
        ],
    },
    enroll: {
        botText: "✅ **How to Enroll:**\n\n1️⃣ Click **Explore Course** on the homepage\n2️⃣ Choose your course (Python / React / MERN)\n3️⃣ Hit **Buy Now** or **Free Trial**\n4️⃣ You'll receive the Google Meet link directly\n\nIt's that simple! 🎉",
        options: [
            { label: "📚 View Courses", value: "courses" },
            { label: "📞 Need Help?", value: "contact" },
            { label: "⬅️ Back to Menu", value: "menu" },
        ],
    },
    contact: {
        botText: "📞 **Contact Dev Coaching:**\n\n📧 Email: Johan@gmail.com\n📱 Phone: +91 7023400611\n\nFeel free to reach out — we typically respond within minutes! 😊",
        options: [
            { label: "📚 View Courses", value: "courses" },
            { label: "✅ How to Enroll", value: "enroll" },
            { label: "⬅️ Back to Menu", value: "menu" },
        ],
    },
    // AI Fallback
    fallback: {
        botText: "I'm not exactly sure about that, but our team can help! You can check our main topics or contact us directly.",
        options: [
            { label: "📚 Our Courses", value: "courses" },
            { label: "📞 Contact Us", value: "contact" },
            { label: "⬅️ Back to Menu", value: "menu" },
        ]
    }
};

// Simple keyword matching for AI Assistant
function matchIntent(text) {
    const t = text.toLowerCase();
    if (t.includes("price") || t.includes("cost") || t.includes("fee") || t.includes("pay")) return "fees";
    if (t.includes("course") || t.includes("learn") || t.includes("study") || t.includes("program")) return "courses";
    if (t.includes("python")) return "python";
    if (t.includes("react") || t.includes("frontend")) return "react";
    if (t.includes("mern") || t.includes("fullstack") || t.includes("node")) return "mern";
    if (t.includes("time") || t.includes("schedule") || t.includes("when")) return "schedule";
    if (t.includes("teacher") || t.includes("instructor") || t.includes("who")) return "teacher";
    if (t.includes("enroll") || t.includes("join") || t.includes("register") || t.includes("buy")) return "enroll";
    if (t.includes("contact") || t.includes("help") || t.includes("support") || t.includes("number")) return "contact";
    if (t.includes("hi") || t.includes("hello") || t.includes("hey")) return "menu";
    return "fallback";
}

// Render **bold** text and \n as <br>
function renderText(text) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part.split("\n").map((line, j, arr) => (
            <span key={`${i}-${j}`}>
                {line}
                {j < arr.length - 1 && <br />}
            </span>
        ));
    });
}

let msgCounter = 0;
function mkId() { return `msg_${++msgCounter}_${Date.now()}`; }

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [options, setOptions] = useState(MAIN_MENU);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const [started, setStarted] = useState(false);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isBotTyping]);

    // Clear unread when opened
    useEffect(() => {
        if (open) setUnread(0);
    }, [open]);

    // Kick off the conversation when panel opens for the first time
    useEffect(() => {
        if (open && !started) {
            setStarted(true);
            showBotMessage("menu");
        }
    }, [open, started]);

    function showBotMessage(flowKey, delay = 700) {
        const flow = BOT_FLOWS[flowKey];
        if (!flow) return;

        setIsBotTyping(true);
        setOptions([]);

        setTimeout(() => {
            setIsBotTyping(false);
            const botMsg = {
                id: mkId(),
                from: "bot",
                text: flow.botText,
            };
            setMessages((prev) => [...prev, botMsg]);
            setOptions(flow.options);
            if (!open) setUnread((u) => u + 1);
        }, delay);
    }

    function handleOptionClick(opt) {
        addUserMessage(opt.label);
        showBotMessage(opt.value, 800);
    }

    function addUserMessage(text) {
        setMessages((prev) => [...prev, { id: mkId(), from: "user", text }]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!inputText.trim()) return;
        
        const txt = inputText.trim();
        addUserMessage(txt);
        setInputText("");
        
        // AI Matching Logic
        const intent = matchIntent(txt);
        showBotMessage(intent, 800);
    }

    return (
        <>
            {/* ── Floating bubble ───────────────────────────────────── */}
            <button
                id="chat-bubble-btn"
                className={`chat-bubble ${open ? "chat-bubble--active" : ""}`}
                onClick={() => setOpen((o) => !o)}
                aria-label="Open AI Assistant"
            >
                {open ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
                {!open && unread > 0 && (
                    <span className="chat-bubble__badge">{unread}</span>
                )}
                {!open && <span className="chat-bubble__ping" />}
            </button>

            {/* ── Chat panel ────────────────────────────────────────── */}
            <div
                id="chat-panel"
                className={`chat-panel ${open ? "chat-panel--open" : ""}`}
                role="dialog"
                aria-label="AI Assistant Chat"
            >
                {/* Header */}
                <div className="chat-panel__header">
                    <div className="chat-panel__header-avatar">✨</div>
                    <div className="chat-panel__header-info">
                        <p className="chat-panel__header-name">AI Assistant</p>
                        <span className="chat-panel__status chat-panel__status--online">
                            Ready to help
                        </span>
                    </div>
                    <button
                        className="chat-panel__close"
                        onClick={() => setOpen(false)}
                        aria-label="Close chat"
                    >×</button>
                </div>

                {/* Messages */}
                <div className="chat-panel__messages" id="chat-messages-area">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-msg ${msg.from === "user" ? "chat-msg--user" : "chat-msg--bot"}`}
                        >
                            {msg.from === "bot" && (
                                <div className="chat-msg__bot-avatar">✨</div>
                            )}
                            <div className="chat-msg__bubble">
                                {renderText(msg.text)}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isBotTyping && (
                        <div className="chat-msg chat-msg--bot">
                            <div className="chat-msg__bot-avatar">✨</div>
                            <div className="chat-msg__bubble chat-msg__bubble--typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick-reply chips */}
                {options.length > 0 && !isBotTyping && (
                    <div className="chat-panel__chips">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                className="chat-chip"
                                onClick={() => handleOptionClick(opt)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Free Text Input */}
                <form className="chat-panel__input-area" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={isBotTyping}
                    />
                    <button type="submit" disabled={!inputText.trim() || isBotTyping}>
                        <FiSend />
                    </button>
                </form>
            </div>
        </>
    );
}
