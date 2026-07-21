import './Note.css';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { IoSearchOutline } from "react-icons/io5";
import {
    MdAdd, MdDeleteOutline, MdOutlineClose, MdBook, MdPerson,
    MdStickyNote2, MdEdit, MdFavorite, MdFavoriteBorder,
    MdVisibility, MdCloudUpload, MdPictureAsPdf, MdLink,
    MdTextSnippet, MdNavigateNext, MdNavigateBefore, MdDownload
} from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

function Note() {
    const [notes, setNotes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
    const [activeViewerNote, setActiveViewerNote] = useState(null);

    // Form inputs
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('PYTHON');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [noteType, setNoteType] = useState('text');
    const [link, setLink] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfUploadedUrl, setPdfUploadedUrl] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);

    // PDF viewer state
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    // Likes (stored in localStorage)
    const [likedNotes, setLikedNotes] = useState(() => {
        try {
            const stored = localStorage.getItem('devcoaching_liked_notes');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    });

    const CATEGORIES = ['ALL', 'PYTHON', 'FRONTEND', 'BACKEND', 'UI/UX', 'DSA', 'DEVOPS', 'DATABASE', 'MOBILE'];

    // Fetch notes
    const fetchNotes = useCallback(() => {
        axios.get(`${API_BASE}/notes?category=${selectedCategory}`)
            .then((res) => {
                setNotes(res.data?.notes || []);
            })
            .catch((err) => {
                console.error("Error fetching notes:", err);
            });
    }, [selectedCategory]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // Save liked notes to localStorage
    useEffect(() => {
        localStorage.setItem('devcoaching_liked_notes', JSON.stringify([...likedNotes]));
    }, [likedNotes]);

    // Reset form
    const resetForm = () => {
        setTitle('');
        setSubject('');
        setCategory('PYTHON');
        setAuthor('');
        setContent('');
        setNoteType('text');
        setLink('');
        setPdfFile(null);
        setPdfUploadedUrl('');
        setErrorMsg('');
        setIsEditing(false);
        setEditingNoteId(null);
    };

    // Open form for new note
    const handleOpenNewForm = () => {
        resetForm();
        setIsUploadOpen(true);
    };

    // Open form for editing
    const handleEditNote = (note) => {
        setTitle(note.title);
        setSubject(note.subject);
        setCategory(note.category);
        setAuthor(note.author);
        setContent(note.content || '');
        setNoteType(note.noteType || 'text');
        setLink(note.link || '');
        setPdfUploadedUrl(note.pdfUrl || '');
        setPdfFile(null);
        setErrorMsg('');
        setIsEditing(true);
        setEditingNoteId(note._id);
        setIsUploadOpen(true);
    };

    // Upload PDF file first
    const handlePdfUpload = async () => {
        if (!pdfFile) return null;

        const formData = new FormData();
        formData.append('pdf', pdfFile);

        try {
            const res = await axios.post(`${API_BASE}/notes/upload-pdf`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.pdfUrl;
        } catch (err) {
            throw new Error(err.response?.data?.message || "Failed to upload PDF");
        }
    };

    // Handle Note Upload/Edit Submit
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsSubmitting(true);

        try {
            if (!title || !subject || !category || !author) {
                setErrorMsg("Title, subject, category, and author are required.");
                setIsSubmitting(false);
                return;
            }

            // Validate based on noteType
            if (noteType === 'text' && !content) {
                setErrorMsg("Note content is required for text notes.");
                setIsSubmitting(false);
                return;
            }
            if (noteType === 'link' && !link) {
                setErrorMsg("A URL link is required for link notes.");
                setIsSubmitting(false);
                return;
            }
            if (noteType === 'pdf' && !pdfFile && !pdfUploadedUrl) {
                setErrorMsg("A PDF file is required for PDF notes.");
                setIsSubmitting(false);
                return;
            }

            let finalPdfUrl = pdfUploadedUrl;

            // If it's a PDF type and we have a new file, upload it first
            if (noteType === 'pdf' && pdfFile) {
                finalPdfUrl = await handlePdfUpload();
            }

            const noteData = {
                title,
                subject,
                content: noteType === 'text' ? content : '',
                category,
                author,
                noteType,
                link: noteType === 'link' ? link : '',
                pdfUrl: noteType === 'pdf' ? finalPdfUrl : ''
            };

            if (isEditing && editingNoteId) {
                // Update existing note
                await axios.put(`${API_BASE}/notes/${editingNoteId}`, noteData);
            } else {
                // Create new note
                await axios.post(`${API_BASE}/notes`, noteData);
            }

            resetForm();
            setIsUploadOpen(false);
            fetchNotes();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || "Failed to save note.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Note Delete
    const handleDeleteNote = (id) => {
        if (window.confirm("Are you sure you want to delete this study note?")) {
            axios.delete(`${API_BASE}/notes/${id}`)
                .then(() => {
                    fetchNotes();
                })
                .catch((err) => {
                    console.error("Error deleting note:", err);
                });
        }
    };

    // Track view and open note content/URL/PDF
    const handleOpenNote = async (note) => {
        // Increment view count
        try {
            await axios.patch(`${API_BASE}/notes/${note._id}/view`);
            // Update local state
            setNotes(prev => prev.map(n =>
                n._id === note._id ? { ...n, views: (n.views || 0) + 1 } : n
            ));
        } catch (err) {
            console.error("Error tracking view:", err);
        }

        const type = note.noteType || 'text';

        if (type === 'link' || (type === 'text' && (note.content?.startsWith('http://') || note.content?.startsWith('https://')))) {
            const url = type === 'link' ? note.link : note.content;
            window.open(url, '_blank');
        } else if (type === 'pdf') {
            setActiveViewerNote(note);
            setPageNumber(1);
            setNumPages(null);
            setIsPdfViewerOpen(true);
        } else {
            setActiveViewerNote(note);
            setIsViewerOpen(true);
        }
    };

    // Like a note
    const handleLikeNote = async (noteId) => {
        if (likedNotes.has(noteId)) return; // Already liked

        try {
            const res = await axios.patch(`${API_BASE}/notes/${noteId}/like`);
            setLikedNotes(prev => {
                const newSet = new Set(prev);
                newSet.add(noteId);
                return newSet;
            });
            // Update local state
            setNotes(prev => prev.map(n =>
                n._id === noteId ? { ...n, likes: res.data.likes } : n
            ));
        } catch (err) {
            console.error("Error liking note:", err);
        }
    };

    // PDF document load success
    const onPdfLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    // Download PDF
    const handleDownloadPdf = (note) => {
        const url = `${import.meta.env.VITE_API_URL}${note.pdfUrl}`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
            case 'DSA': return 'tag-dsa';
            case 'DEVOPS': return 'tag-devops';
            case 'DATABASE': return 'tag-database';
            case 'MOBILE': return 'tag-mobile';
            default: return '';
        }
    };

    const getNoteTypeIcon = (type) => {
        switch (type) {
            case 'link': return <MdLink className="note-type-icon type-link" />;
            case 'pdf': return <MdPictureAsPdf className="note-type-icon type-pdf" />;
            default: return <MdTextSnippet className="note-type-icon type-text" />;
        }
    };

    const getNoteTypeLabel = (type) => {
        switch (type) {
            case 'link': return 'Link';
            case 'pdf': return 'PDF';
            default: return 'Text';
        }
    };

    // Handle drag and drop for PDF
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            setPdfFile(files[0]);
        } else {
            setErrorMsg("Only PDF files are allowed.");
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
                            onClick={handleOpenNewForm}
                        >
                            <MdAdd size={20} /> Share Note
                        </button>
                    </div>
                </div>

                {/* Grid Content */}
                <div className="row note-grid">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => {
                            const type = note.noteType || 'text';
                            const isLiked = likedNotes.has(note._id);
                            return (
                                <div className="col-lg-4 col-md-6 note-card-col" key={note._id}>
                                    <div className="note-card">
                                        <div>
                                            <div className="note-card-header">
                                                <div className="note-card-header-left">
                                                    <span className={`note-tag ${formatNoteTag(note.category)}`}>
                                                        {note.category}
                                                    </span>
                                                    <span className="note-type-badge">
                                                        {getNoteTypeIcon(type)}
                                                        {getNoteTypeLabel(type)}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-edit-note"
                                                    title="Edit Note"
                                                    onClick={() => handleEditNote(note)}
                                                >
                                                    <MdEdit size={16} />
                                                </button>
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
                                            <div className="note-card-footer-left">
                                                <span className="note-date">
                                                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                                <div className="note-stats">
                                                    <button
                                                        type="button"
                                                        className={`btn-like-note ${isLiked ? 'liked' : ''}`}
                                                        onClick={() => handleLikeNote(note._id)}
                                                        title={isLiked ? 'Already liked' : 'Like this note'}
                                                    >
                                                        {isLiked ? <MdFavorite size={16} /> : <MdFavoriteBorder size={16} />}
                                                        <span>{note.likes || 0}</span>
                                                    </button>
                                                    <span className="note-views" title="Views">
                                                        <MdVisibility size={14} />
                                                        <span>{note.views || 0}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="note-card-actions">
                                                {type === 'pdf' && (
                                                    <button
                                                        type="button"
                                                        className="btn-download-note"
                                                        onClick={() => handleDownloadPdf(note)}
                                                        title="Download PDF"
                                                    >
                                                        <MdDownload size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="btn-read-note"
                                                    onClick={() => handleOpenNote(note)}
                                                >
                                                    {type === 'link' ? (
                                                        <>Link <FiExternalLink /></>
                                                    ) : type === 'pdf' ? (
                                                        <>View <MdPictureAsPdf /></>
                                                    ) : (
                                                        <>Read <MdBook /></>
                                                    )}
                                                </button>
                                            </div>
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

            {/* Modal: Share / Edit Note Form */}
            {isUploadOpen && (
                <div className="neon-modal-overlay" onClick={() => { setIsUploadOpen(false); resetForm(); }}>
                    <div className="neon-modal neon-modal-wide" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn-modal-close"
                            onClick={() => { setIsUploadOpen(false); resetForm(); }}
                        >
                            <MdOutlineClose />
                        </button>
                        <h3 className="modal-title">
                            {isEditing ? 'Edit Study ' : 'Share Study '}
                            <span>Note</span>
                        </h3>

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
                                        <option value="DSA">DSA</option>
                                        <option value="DEVOPS">DEVOPS</option>
                                        <option value="DATABASE">DATABASE</option>
                                        <option value="MOBILE">MOBILE</option>
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

                            {/* Content Type Selector */}
                            <div className="form-group">
                                <label className="form-label">Content Type</label>
                                <div className="note-type-selector">
                                    <button
                                        type="button"
                                        className={`type-option ${noteType === 'text' ? 'active' : ''}`}
                                        onClick={() => setNoteType('text')}
                                    >
                                        <MdTextSnippet size={18} />
                                        <span>Text</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`type-option ${noteType === 'link' ? 'active' : ''}`}
                                        onClick={() => setNoteType('link')}
                                    >
                                        <MdLink size={18} />
                                        <span>Link</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`type-option ${noteType === 'pdf' ? 'active' : ''}`}
                                        onClick={() => setNoteType('pdf')}
                                    >
                                        <MdPictureAsPdf size={18} />
                                        <span>PDF</span>
                                    </button>
                                </div>
                            </div>

                            {/* Conditional Content Input */}
                            {noteType === 'text' && (
                                <div className="form-group">
                                    <label className="form-label">Note Content</label>
                                    <textarea
                                        className="form-control"
                                        rows="5"
                                        placeholder="Enter your study notes here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            {noteType === 'link' && (
                                <div className="form-group">
                                    <label className="form-label">External Link (Drive / GitHub / Website)</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        placeholder="https://drive.google.com/... or https://github.com/..."
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            {noteType === 'pdf' && (
                                <div className="form-group">
                                    <label className="form-label">Upload PDF File (Max 20MB)</label>
                                    <div
                                        className={`pdf-dropzone ${pdfFile ? 'has-file' : ''}`}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('pdf-file-input').click()}
                                    >
                                        {pdfFile ? (
                                            <div className="pdf-file-info">
                                                <MdPictureAsPdf size={32} className="pdf-file-icon" />
                                                <div>
                                                    <p className="pdf-file-name">{pdfFile.name}</p>
                                                    <p className="pdf-file-size">{(pdfFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn-remove-file"
                                                    onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                                                >
                                                    <MdOutlineClose size={18} />
                                                </button>
                                            </div>
                                        ) : pdfUploadedUrl ? (
                                            <div className="pdf-file-info">
                                                <MdPictureAsPdf size={32} className="pdf-file-icon" />
                                                <div>
                                                    <p className="pdf-file-name">Previously uploaded PDF</p>
                                                    <p className="pdf-file-size">Click to replace</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pdf-dropzone-content">
                                                <MdCloudUpload size={40} />
                                                <p>Drag & drop your PDF here or <span>browse</span></p>
                                                <small>Maximum file size: 20MB</small>
                                            </div>
                                        )}
                                        <input
                                            id="pdf-file-input"
                                            type="file"
                                            accept=".pdf"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    setPdfFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => { setIsUploadOpen(false); resetForm(); }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Note' : 'Upload Note')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Note Content Viewer (Text) */}
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

            {/* Modal: PDF Viewer */}
            {isPdfViewerOpen && activeViewerNote && (
                <div className="neon-modal-overlay" onClick={() => setIsPdfViewerOpen(false)}>
                    <div className="neon-modal neon-modal-pdf" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="btn-modal-close"
                            onClick={() => setIsPdfViewerOpen(false)}
                        >
                            <MdOutlineClose />
                        </button>

                        <div className="pdf-viewer-header">
                            <div>
                                <span className={`note-tag mb-2 d-inline-block ${formatNoteTag(activeViewerNote.category)}`}>
                                    {activeViewerNote.category}
                                </span>
                                <h3 className="modal-title mt-1 mb-0 border-0 pb-0">
                                    {activeViewerNote.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                className="btn-download-pdf"
                                onClick={() => handleDownloadPdf(activeViewerNote)}
                            >
                                <MdDownload size={18} />
                                Download
                            </button>
                        </div>

                        <div className="pdf-viewer-container">
                            <Document
                                file={`${import.meta.env.VITE_API_URL}${activeViewerNote.pdfUrl}`}
                                onLoadSuccess={onPdfLoadSuccess}
                                loading={
                                    <div className="pdf-loading">
                                        <div className="pdf-loading-spinner"></div>
                                        <p>Loading PDF...</p>
                                    </div>
                                }
                                error={
                                    <div className="pdf-error">
                                        <MdPictureAsPdf size={48} />
                                        <p>Failed to load PDF. Try downloading instead.</p>
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    width={Math.min(window.innerWidth * 0.8, 700)}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                />
                            </Document>
                        </div>

                        {numPages && (
                            <div className="pdf-navigation">
                                <button
                                    type="button"
                                    className="btn-pdf-nav"
                                    disabled={pageNumber <= 1}
                                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                >
                                    <MdNavigateBefore size={20} /> Prev
                                </button>
                                <span className="pdf-page-info">
                                    Page {pageNumber} of {numPages}
                                </span>
                                <button
                                    type="button"
                                    className="btn-pdf-nav"
                                    disabled={pageNumber >= numPages}
                                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                                >
                                    Next <MdNavigateNext size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Note;
