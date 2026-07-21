import './Contact.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaLocationArrow } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdOutlineWatchLater } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";

const CONTACT_INFO = [
    { icon: FaLocationArrow, title: "Address", text: "123 Main St, Anytown, USA" },
    { icon: FaPhoneAlt, title: "Phone", text: "+91 9876543210" },
    { icon: MdEmail, title: "Email", text: "coachingdev072@gmail.com" },
    { icon: MdOutlineWatchLater, title: "Working Hours", text: "Mon to Sat: 9:00 AM - 11:00 PM" },
];

const SUBJECTS = ["Courses", "Live Classes", "Enrollment", "Other"];

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

function handleTilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
}

function resetTilt(card) {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
}

function Contact() {
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Name is required";
        if (!form.email.trim()) {
            next.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            next.email = "Enter a valid email address";
        }
        if (!form.subject) next.subject = "Please select a subject";
        if (!form.message.trim()) next.message = "Message is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        if (errors.submit) setErrors((prev) => ({ ...prev, submit: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const response = await fetch("/api/Contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setForm(INITIAL_FORM);
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setErrors({ submit: data.message || "Failed to send message." });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setErrors({ submit: "A network error occurred. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <div className="contact-page">
            <div className="container">
                {/* Hero */}
                <section className="contact-hero reveal">
                    <div className="contact-hero__shapes" aria-hidden="true">
                        <div className="contact-shape contact-shape--cube" />
                        <div className="contact-shape contact-shape--ring" />
                        <div className="contact-shape contact-shape--block" />
                        <div className="contact-shape contact-shape--diamond" />
                    </div>
                    <span className="contact-hero__label">Contact Us</span>
                    <h1 className="contact-hero__title">
                        Get in Touch With Our <span>Developer Education Team</span>
                    </h1>
                    <p className="contact-hero__subtitle">
                        Have questions about live classes, notes, exam papers, courses, or teacher details?
                        Reach out and our team will help you choose the right learning path.
                    </p>
                    <button type="button" className="contact-hero__cta" onClick={() => navigate("/course")}>
                        Explore Courses <FaArrowRightLong style={{ marginLeft: 8 }} />
                    </button>
                </section>

                {/* Main content */}
                <div className="row g-4 align-items-stretch">
                    {/* Info column */}
                    <div className="col-lg-5 reveal reveal-delay-1">
                        <div
                            className="contact-3d-wrap"
                            onMouseMove={(e) => handleTilt(e, e.currentTarget.querySelector(".contact-3d-card"))}
                            onMouseLeave={(e) => resetTilt(e.currentTarget.querySelector(".contact-3d-card"))}
                        >
                            <div className="contact-info-panel contact-3d-card">
                                <div className="contact-info-panel__header">
                                    <HiOutlineInformationCircle />
                                    <h4>Contact Information</h4>
                                </div>
                                {CONTACT_INFO.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div className="contact-info-item" key={item.title}>
                                            <div className="contact-info-item__icon">
                                                <Icon />
                                            </div>
                                            <div>
                                                <h5 className="contact-info-item__title">{item.title}</h5>
                                                <p className="contact-info-item__text">{item.text}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Form column */}
                    <div className="col-lg-7 reveal reveal-delay-2">
                        <div
                            className="contact-3d-wrap"
                            onMouseMove={(e) => handleTilt(e, e.currentTarget.querySelector(".contact-3d-card"))}
                            onMouseLeave={(e) => resetTilt(e.currentTarget.querySelector(".contact-3d-card"))}
                        >
                            <div className="contact-form-panel contact-3d-card">
                                <h3 className="contact-form__title">Send Us a Message</h3>
                                <p className="contact-form__subtitle">
                                    Fill out the form below and we'll respond within 24 hours.
                                </p>

                                {submitted && (
                                    <div className="contact-success" role="alert">
                                        Message sent! We'll get back to you within 24 hours.
                                    </div>
                                )}

                                {errors.submit && (
                                    <div className="contact-error" role="alert">
                                        {errors.submit}
                                    </div>
                                )}

                                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                    <div className="contact-form__group">
                                        <label className="contact-form__label" htmlFor="name">Full Name</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className={`contact-form__input${errors.name ? " contact-form__input--error" : ""}`}
                                            placeholder="Your full name"
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <p className="contact-form__error">{errors.name}</p>}
                                    </div>

                                    <div className="contact-form__group">
                                        <label className="contact-form__label" htmlFor="email">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className={`contact-form__input${errors.email ? " contact-form__input--error" : ""}`}
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <p className="contact-form__error">{errors.email}</p>}
                                    </div>

                                    <div className="contact-form__group">
                                        <label className="contact-form__label" htmlFor="subject">Subject</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            className={`contact-form__select${errors.subject ? " contact-form__select--error" : ""}`}
                                            value={form.subject}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a subject</option>
                                            {SUBJECTS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {errors.subject && <p className="contact-form__error">{errors.subject}</p>}
                                    </div>

                                    <div className="contact-form__group">
                                        <label className="contact-form__label" htmlFor="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            className={`contact-form__textarea${errors.message ? " contact-form__textarea--error" : ""}`}
                                            placeholder="Tell us how we can help you..."
                                            value={form.message}
                                            onChange={handleChange}
                                        />
                                        {errors.message && <p className="contact-form__error">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="contact-form__submit"
                                        disabled={submitting}
                                        onClick={handleSubmit}
                                    >
                                        {submitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;