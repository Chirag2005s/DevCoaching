import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import './OnboardingTour.css';

const TOUR_STEPS = [
    {
        title: "Welcome to Dev Coaching v4.0! 🚀",
        content: "Let's take a quick tour of the new features. We've added a ton of new tools to help you learn better.",
        target: null,
        placement: 'center'
    },
    {
        title: "Global Search",
        content: "Press Ctrl+K (or Cmd+K) from anywhere to instantly search courses, notes, exams, and pages.",
        target: '.nav-search-btn',
        placement: 'bottom'
    },
    {
        title: "Theme Customization",
        content: "Bored of the default colors? Click here to switch between Dark/Light mode and 5 vibrant color palettes.",
        target: '.tp-trigger',
        placement: 'bottom-left'
    },
    {
        title: "Quick Actions",
        content: "Need to jump somewhere fast? This floating menu gives you instant access to your Dashboard, Live classes, and more.",
        target: '.qa-fab',
        placement: 'top-left'
    },
    {
        title: "Keyboard Shortcuts",
        content: "Power user? Press Shift + ? anytime to view all available keyboard shortcuts.",
        target: null,
        placement: 'center'
    }
];

export default function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('onboarding_completed');
        if (!hasSeenTour) {
            const t = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(t);
        }
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        const step = TOUR_STEPS[currentStep];
        if (step.target) {
            const el = document.querySelector(step.target);
            if (el) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
            } else {
                setTargetRect(null);
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            closeTour();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(c => c - 1);
        }
    };

    const closeTour = () => {
        setIsVisible(false);
        localStorage.setItem('onboarding_completed', 'true');
    };

    if (!isVisible) return null;

    const step = TOUR_STEPS[currentStep];
    const isCenter = !step.target || !targetRect;

    let tooltipStyle = {};
    if (!isCenter && targetRect) {
        const spacing = 16;
        if (step.placement === 'bottom') {
            tooltipStyle = { top: targetRect.top + targetRect.height + spacing, left: targetRect.left + (targetRect.width / 2), transform: 'translateX(-50%)' };
        } else if (step.placement === 'bottom-left') {
            tooltipStyle = { top: targetRect.top + targetRect.height + spacing, right: window.innerWidth - targetRect.left - targetRect.width };
        } else if (step.placement === 'top-left') {
            tooltipStyle = { bottom: window.innerHeight - targetRect.top + spacing, right: window.innerWidth - targetRect.left - targetRect.width };
        }
    } else {
        tooltipStyle = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }

    return (
        <div className="tour-overlay">
            {!isCenter && targetRect && (
                <div 
                    className="tour-spotlight"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16
                    }}
                />
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    className={`tour-tooltip ${isCenter ? 'tour-tooltip-center' : ''}`}
                    style={tooltipStyle}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                >
                    <button className="tour-close" onClick={closeTour} title="Skip Tour"><FiX /></button>
                    
                    <div className="tour-content">
                        <h3>{step.title}</h3>
                        <p>{step.content}</p>
                    </div>

                    <div className="tour-footer">
                        <div className="tour-dots">
                            {TOUR_STEPS.map((_, i) => (
                                <span key={i} className={`tour-dot ${i === currentStep ? 'active' : ''}`} />
                            ))}
                        </div>
                        <div className="tour-controls">
                            {currentStep > 0 && (
                                <button className="tour-btn secondary" onClick={handlePrev}>
                                    <FiChevronLeft /> Back
                                </button>
                            )}
                            <button className="tour-btn primary" onClick={handleNext}>
                                {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : <>Next <FiChevronRight /></>}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
