import { useEffect, useRef, useState } from "react";
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
        botText: "👋 Hi! I'm the **Dev Coaching** assistant.\n\nWhat would you like to know?",
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
};

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
    const [currentFlow, setCurrentFlow] = useState("menu");
    const [options, setOptions] = useState(MAIN_MENU);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const [started, setStarted] = useState(false);  // shown welcome?
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
    }, [open]);

    function showBotMessage(flowKey, delay = 700) {
        const flow = BOT_FLOWS[flowKey];
        if (!flow) return;

        setIsBotTyping(true);
        setOptions([]); // hide chips while bot "types"

        setTimeout(() => {
            setIsBotTyping(false);
            const botMsg = {
                id: mkId(),
                from: "bot",
                text: flow.botText,
            };
            setMessages((prev) => [...prev, botMsg]);
            setOptions(flow.options);
            setCurrentFlow(flowKey);
            if (!open) setUnread((u) => u + 1);
        }, delay);
    }

    function handleOptionClick(opt) {
        // 1. Add the user's choice as a message bubble
        const userMsg = {
            id: mkId(),
            from: "user",
            text: opt.label,
        };
        setMessages((prev) => [...prev, userMsg]);

        // 2. Bot replies
        showBotMessage(opt.value, 800);
    }

    return (
        <>
            {/* ── Floating bubble ───────────────────────────────────── */}
            <button
                id="chat-bubble-btn"
                className={`chat-bubble ${open ? "chat-bubble--active" : ""}`}
                onClick={() => setOpen((o) => !o)}
                aria-label="Open Dev Coaching Chat"
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
                aria-label="Dev Coaching Chat"
            >
                {/* Header */}
                <div className="chat-panel__header">
                    <div className="chat-panel__header-avatar">🤖</div>
                    <div className="chat-panel__header-info">
                        <p className="chat-panel__header-name">Dev Coaching Bot</p>
                        <span className="chat-panel__status chat-panel__status--online">
                            Always online
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
                                <div className="chat-msg__bot-avatar">🤖</div>
                            )}
                            <div className="chat-msg__bubble">
                                {renderText(msg.text)}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isBotTyping && (
                        <div className="chat-msg chat-msg--bot">
                            <div className="chat-msg__bot-avatar">🤖</div>
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
                                id={`chat-chip-${opt.value}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="chat-panel__footer">
                    <p className="chat-panel__powered">⚡ Powered by Dev Coaching</p>
                </div>
            </div>
        </>
    );
}
