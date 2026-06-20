import './Note.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearchOutline } from "react-icons/io5";
import { MdAdd, MdDeleteOutline, MdOutlineClose, MdBook, MdPerson, MdStickyNote2 } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";

function Note() {
    const [notes, setNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [activeViewerNote, setActiveViewerNote] = useState(null);

    // Form inputs
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('PYTHON');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const CATEGORIES = ['ALL', 'PYTHON', 'FRONTEND', 'BACKEND', 'UI/UX'];

    // Fetch notes
    const fetchNotes = () => {
        axios.get(`http://localhost:9000/api/notes?category=${selectedCategory}`)
            .then((res) => {
                setNotes(res.data?.notes || []);
            })
            .catch((err) => {
                console.error("Error fetching notes:", err);
            });
    };

    useEffect(() => {
        fetchNotes();
    }, [selectedCategory]);

    // Handle Note Upload Submit
    const handleUploadSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!title || !subject || !content || !category || !author) {
            setErrorMsg("All fields are required.");
            return;
        }

        const newNote = { title, subject, content, category, author };

        axios.post('http://localhost:9000/api/notes', newNote)
            .then(() => {
                // Clear fields
                setTitle('');
                setSubject('');
                setCategory('PYTHON');
                setAuthor('');
                setContent('');
                setIsUploadOpen(false);
                fetchNotes();
            })
            .catch((err) => {
                setErrorMsg(err.response?.data?.message || "Failed to create note.");
            });
    };

    // Handle Note Delete
    const handleDeleteNote = (id) => {
        if (window.confirm("Are you sure you want to delete this study note?")) {
            axios.delete(`http://localhost:9000/api/notes/${id}`)
                .then(() => {
                    fetchNotes();
                })
                .catch((err) => {
                    console.error("Error deleting note:", err);
                });
        }
    };

    // Open Note content or URL
    const handleOpenNote = (note) => {
        const isUrl = note.content.startsWith('http://') || note.content.startsWith('https://');
        if (isUrl) {
            window.open(note.content, '_blank');
        } else {
            setActiveViewerNote(note);
            setIsViewerOpen(true);
        }
    };

    // Filter notes list locally with search term
    const filteredNotes = notes.filter((note) => {
        const searchLower = search.toLowerCase();
        return (
            note.title?.toLowerCase().includes(searchLower) ||
            note.subject?.toLowerCase().includes(searchLower) ||
            note.author?.toLowerCase().includes(searchLower)
        );
    });

    const formatNoteTag = (cat) => {
        switch (cat?.toUpperCase()) {
            case 'PYTHON': return 'tag-python';
            case 'FRONTEND': return 'tag-frontend';
            case 'BACKEND': return 'tag-backend';
            case 'UI/UX': return 'tag-ui-ux';
            default: return '';
        }
    };

    return (
        <div className="note-page">
            <div className="container">
                {/* Header */}
                <div className="note-header text-center text-md-start">
                    <h1 className="note-title">Study <span>Notes</span></h1>
                    <p className="note-subtitle">Browse, download, or share community-driven programming lecture notes and resources</p>
                </div>

                {/* Controls */}
                <div className="note-controls">
                    <div className="category-tabs">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat === 'ALL' ? 'ALL' : cat}
                            </button>
                        ))}
                    </div>

                    <div className="d-flex gap-3 align-items-center w-100 w-md-auto flex-column flex-md-row">
                        <div className="note-search-wrap">
                            <IoSearchOutline className="note-search-icon" />
                            <input
                                type="text"
                                className="note-search-input"
                                placeholder="Search by title, subject..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className="btn-upload-note"
                            onClick={() => setIsUploadOpen(true)}
                        >
                            <MdAdd size={20} /> Share Note
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="row note-grid">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => {
                            const isUrl = note.content.startsWith('http://') || note.content.startsWith('https://');
                            return (
                                <div className="col-lg-4 col-md-6 note-card-col" key={note._id}>
                                    <div className="note-card">
                                        <div>
                                            <div className="note-card-header">
                                                <span className={`note-tag ${formatNoteTag(note.category)}`}>
                                                    {note.category}
                                                </span>
                                                {/* <button
                                                    type="button"
                                                    className="btn-delete-note"
                                                    title="Delete Note"
                                                    onClick={() => handleDeleteNote(note._id)}
                                                >
                                                    <MdDeleteOutline size={20} />
                                                </button> */}
                                            </div>

                                            <div className="note-card-body">
                                                <div className="note-subject">{note.subject}</div>
                                                <h4 className="note-card-title">{note.title}</h4>
                                                <div className="note-author">
                                                    <MdPerson className="note-author-icon" />
                                                    <span>By {note.author}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="note-card-footer">
                                            <span className="note-date">
                                                {new Date(note.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn-read-note"
                                                onClick={() => handleOpenNote(note)}
                                            >
                                                {isUrl ? (
                                                    <>
                                                        Link <FiExternalLink />
                                                    </>
                                                ) : (
                                                    <>
                                                        Read <MdBook />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12">
                            <div className="empty-state">
                                <MdStickyNote2 size={64} style={{ color: '#14daff' }} />
                                <h3>No Study Notes Found</h3>
                                <p>Be the first to share your notes or resources with other students!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal: Share Note Form */}
            {isUploadOpen && (
                <div className="neon-modal-overlay" onClick={() => setIsUploadOpen(false)}>
                    <div className="neon-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn-modal-close"
                            onClick={() => setIsUploadOpen(false)}
                        >
                            <MdOutlineClose />
                        </button>
                        <h3 className="modal-title">Share Study <span>Note</span></h3>

                        {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}

                        <form onSubmit={handleUploadSubmit}>
                            <div className="form-group">
                                <label className="form-label">Note Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Intro to React Hooks"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Subject</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Web Development"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="PYTHON">PYTHON</option>
                                        <option value="FRONTEND">FRONTEND</option>
                                        <option value="BACKEND">BACKEND</option>
                                        <option value="UI/UX">UI/UX DESIGNER</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Your Name (Author)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Jane Doe"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Note Content or Link (Drive/GitHub)</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter study text notes or a URL starting with http:// or https://"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setIsUploadOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    Upload Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Note Content Viewer */}
            {isViewerOpen && activeViewerNote && (
                <div className="neon-modal-overlay" onClick={() => setIsViewerOpen(false)}>
                    <div className="neon-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn-modal-close"
                            onClick={() => setIsViewerOpen(false)}
                        >
                            <MdOutlineClose />
                        </button>
                        <span className={`note-tag mb-2 d-inline-block ${formatNoteTag(activeViewerNote.category)}`}>
                            {activeViewerNote.category}
                        </span>
                        <h3 className="modal-title mt-1 mb-2 border-0 pb-0">
                            {activeViewerNote.title}
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }} className="mb-4">
                            Subject: {activeViewerNote.subject} | By {activeViewerNote.author}
                        </p>

                        <div className="note-viewer-content">
                            {activeViewerNote.content}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-submit"
                                onClick={() => setIsViewerOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Note;
