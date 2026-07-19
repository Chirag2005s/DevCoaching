import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Trash2,
  Monitor,
  Smartphone,
  Tablet,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ShieldAlert,
  Activity,
  LogIn,
  UserPlus,
  RefreshCw,
  Bot,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { api } from '../hooks/useApi';
import './admin.shared.css';
import './AccessLogsPage.css';

export default function AccessLogsPage() {
  const { user } = useAuth();

  // Query parameters state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const limit = 15;

  // Data state
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLoginsToday: 0,
    failedLoginsToday: 0,
    registrationsToday: 0,
    topDevice: 'Desktop',
  });
  const [pagination, setPagination] = useState({
    totalLogs: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retention cleanup state
  const [cleanupDays, setCleanupDays] = useState(30);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');
  const [cleanupIsError, setCleanupIsError] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch access logs from the server
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/access-logs', {
        params: {
          page,
          limit,
          search: debouncedSearch,
          action,
          status,
        },
      });
      setLogs(response.data.logs || []);
      setPagination(
        response.data.pagination || {
          totalLogs: 0,
          totalPages: 1,
          currentPage: 1,
        }
      );
      setStats(
        response.data.stats || {
          totalLoginsToday: 0,
          failedLoginsToday: 0,
          registrationsToday: 0,
          topDevice: 'Desktop',
        }
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load access logs');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, action, status]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handle cleanup execution
  const handleCleanup = async () => {
    setCleanupLoading(true);
    setCleanupMessage('');
    setCleanupIsError(false);
    try {
      const response = await api.delete('/access-logs/cleanup', {
        data: { days: cleanupDays },
      });
      setCleanupMessage(response.data.message || 'Logs cleaned up successfully.');
      setCleanupIsError(false);
      setShowCleanupConfirm(false);
      fetchLogs();
    } catch (err) {
      console.error(err);
      setCleanupMessage(err.response?.data?.message || 'Failed to clean up logs');
      setCleanupIsError(true);
    } finally {
      setCleanupLoading(false);
      setTimeout(() => setCleanupMessage(''), 5000);
    }
  };

  // BUG FIX: Handle all deviceType enum values including 'Bot/Unknown'
  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Desktop':
        return <Monitor size={15} />;
      case 'Mobile':
        return <Smartphone size={15} />;
      case 'Tablet':
        return <Tablet size={15} />;
      case 'Bot/Unknown':
        return <Bot size={15} />;
      default:
        return <HelpCircle size={15} />;
    }
  };

  const getDeviceLabel = (device) => {
    if (device === 'Bot/Unknown') return 'Bot';
    return device || 'Unknown';
  };

  const getActionBadgeClass = (actionName) => {
    switch (actionName) {
      case 'login':
        return 'bp-blue';
      case 'registration':
        return 'bp-purple';
      case 'logout':
        return 'bp-gray';
      default:
        return 'bp-gray';
    }
  };

  const getActionLabel = (actionName) => {
    switch (actionName) {
      case 'login':
        return 'Login';
      case 'registration':
        return 'Register';
      case 'logout':
        return 'Logout';
      default:
        return actionName || 'Unknown';
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  // BUG FIX: Safe avatar letter — guard against null/undefined name AND email
  const getAvatarLetter = (log) => {
    const source = log.name || log.email || '?';
    return source.charAt(0).toUpperCase();
  };

  // BUG FIX: Replace ALL underscores, not just the first one
  const formatReason = (reason) => {
    if (!reason) return '';
    return reason.replace(/_/g, ' ');
  };

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <div className="admin-page">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="page-top">
        <div className="page-top-left">
          <h1 className="alp-heading">
            <ShieldAlert size={28} className="alp-heading-icon" />
            Access Logs
          </h1>
          <p>Monitor security events, login attempts, registrations, and active session devices.</p>
        </div>
        <button className="btn-icon-sm alp-refresh-btn" onClick={fetchLogs} title="Refresh logs">
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── Audit Summary Statistics ──────────────────────────────── */}
      <div className="alp-stats-grid">
        <div className="alp-stat-card">
          <div className="alp-stat-icon alp-icon-blue">
            <LogIn size={20} />
          </div>
          <div className="alp-stat-body">
            <span className="alp-stat-label">Total Logins Today</span>
            <span className="alp-stat-value">{stats.totalLoginsToday}</span>
          </div>
          <div className="alp-stat-glow alp-glow-blue" />
        </div>

        <div className="alp-stat-card">
          <div className="alp-stat-icon alp-icon-red">
            <ShieldAlert size={20} />
          </div>
          <div className="alp-stat-body">
            <span className="alp-stat-label">Failed Logins Today</span>
            <span className="alp-stat-value alp-value-danger">{stats.failedLoginsToday}</span>
          </div>
          <div className="alp-stat-glow alp-glow-red" />
        </div>

        <div className="alp-stat-card">
          <div className="alp-stat-icon alp-icon-purple">
            <UserPlus size={20} />
          </div>
          <div className="alp-stat-body">
            <span className="alp-stat-label">Registrations Today</span>
            <span className="alp-stat-value">{stats.registrationsToday}</span>
          </div>
          <div className="alp-stat-glow alp-glow-purple" />
        </div>

        <div className="alp-stat-card">
          <div className="alp-stat-icon alp-icon-amber">
            <Monitor size={20} />
          </div>
          <div className="alp-stat-body">
            <span className="alp-stat-label">Top Device Type</span>
            <span className="alp-stat-value">{stats.topDevice || 'N/A'}</span>
          </div>
          <div className="alp-stat-glow alp-glow-amber" />
        </div>
      </div>

      {/* ── Cleanup Status Banner ─────────────────────────────────── */}
      {cleanupMessage && (
        <div className={`alp-banner ${cleanupIsError ? 'alp-banner-error' : 'alp-banner-success'}`}>
          {cleanupIsError ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{cleanupMessage}</span>
        </div>
      )}

      {/* ── Filters + SuperAdmin Actions ─────────────────────────── */}
      <div className="alp-controls">
        <div className="alp-filters">
          {/* Search */}
          <div className="search-input-wrap alp-search-wrap">
            <Search className="search-icon" size={17} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, email, or IP…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div className="alp-select-wrap">
            <select
              className="filter-select-premium"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Actions</option>
              <option value="login">Logins</option>
              <option value="registration">Registrations</option>
              <option value="logout">Logouts</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="alp-select-wrap">
            <select
              className="filter-select-premium"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Superadmin Retention Actions */}
        {isSuperAdmin && (
          <div className="alp-retention">
            <select
              className="filter-select-premium alp-retention-select"
              value={cleanupDays}
              onChange={(e) => setCleanupDays(parseInt(e.target.value))}
            >
              <option value={30}>Older than 30 Days</option>
              <option value={60}>Older than 60 Days</option>
              <option value={90}>Older than 90 Days</option>
            </select>
            <button
              className="btn-danger-sm alp-clean-btn"
              onClick={() => setShowCleanupConfirm(true)}
            >
              <Trash2 size={15} />
              <span>Clean Logs</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Main Table ────────────────────────────────────────────── */}
      <div className="table-card">
        {loading ? (
          <div className="state-box">
            <Activity className="state-spin alp-accent-icon" size={36} />
            <h3>Fetching access logs…</h3>
            <p>Gathering logs from database.</p>
          </div>
        ) : error ? (
          <div className="state-box alp-state-error">
            <AlertCircle size={40} />
            <h3>Failed to load logs</h3>
            <p>{error}</p>
            <button className="btn-primary-sm alp-mt" onClick={fetchLogs}>
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="state-box">
            <ShieldAlert size={40} className="alp-empty-icon" />
            <h3>No Access Logs Found</h3>
            <p>No log records matched your query parameters.</p>
          </div>
        ) : (
          <div className="alp-table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>Device</th>
                  <th>User Agent</th>
                  <th>Date &amp; Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    {/* User Details */}
                    <td>
                      <div className="user-cell">
                        {/* BUG FIX: safe avatar letter guard */}
                        <div
                          className={`user-avatar sm ${
                            log.status === 'failed' ? 'red' : 'green'
                          }`}
                        >
                          {getAvatarLetter(log)}
                        </div>
                        <div className="user-info">
                          <span className="user-name">{log.name || 'Unknown User'}</span>
                          <span className="user-email">{log.email || '—'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action Badge */}
                    <td>
                      <span className={`badge-pill ${getActionBadgeClass(log.action)}`}>
                        <span className="bp-dot" />
                        {getActionLabel(log.action)}
                      </span>
                    </td>

                    {/* Status + Failure Reason */}
                    <td>
                      <div className="alp-status-col">
                        <span
                          className={`badge-pill ${
                            log.status === 'success' ? 'bp-green' : 'bp-red'
                          }`}
                        >
                          <span className="bp-dot" />
                          {log.status === 'success' ? 'Success' : 'Failed'}
                        </span>
                        {/* BUG FIX: replace ALL underscores with replaceAll */}
                        {log.status === 'failed' && log.reason && (
                          <span className="failure-reason-lbl">
                            {formatReason(log.reason)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* IP Address */}
                    <td>
                      <span className="ip-cell-text">{log.ipAddress || '—'}</span>
                    </td>

                    {/* Device */}
                    <td>
                      <div className="device-cell-wrapper">
                        {getDeviceIcon(log.deviceType)}
                        <span>{getDeviceLabel(log.deviceType)}</span>
                      </div>
                    </td>

                    {/* User Agent */}
                    <td>
                      <div className="ua-cell-wrapper" title={log.userAgent}>
                        {log.userAgent ? log.userAgent.split(' ')[0] : '—'}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td>
                      <span className="date-cell-text">{formatDate(log.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────────── */}
      {!loading && !error && logs.length > 0 && (
        <div className="alp-pagination">
          <span className="pagination-count">
            Page <strong>{pagination.currentPage}</strong> of{' '}
            <strong>{pagination.totalPages}</strong>
            <span className="alp-total-badge">{pagination.totalLogs} total logs</span>
          </span>
          <div className="pagination-actions">
            <button
              className="btn-icon-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {/* Page number pills */}
            <div className="alp-page-pills">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`alp-page-pill ${page === pageNum ? 'active' : ''}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {pagination.totalPages > 5 && (
                <span className="alp-page-ellipsis">…</span>
              )}
            </div>

            <button
              className="btn-icon-sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Superadmin Deletion Confirmation Modal ────────────────── */}
      {showCleanupConfirm && (
        <div className="confirm-overlay" onClick={() => !cleanupLoading && setShowCleanupConfirm(false)}>
          <div className="confirm-box alp-confirm-box" onClick={(e) => e.stopPropagation()}>
            <div className="alp-confirm-icon">
              <Trash2 size={36} />
            </div>
            <h3>Confirm Log Deletion</h3>
            <p>
              This will permanently delete all logs older than{' '}
              <strong>{cleanupDays} days</strong>. This action{' '}
              <strong>cannot be undone</strong>.
            </p>
            <div className="confirm-actions">
              <button
                className="btn-confirm-del"
                onClick={handleCleanup}
                disabled={cleanupLoading}
              >
                {cleanupLoading ? (
                  <>
                    <Activity size={15} className="state-spin" />
                    Clearing…
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Confirm Deletion
                  </>
                )}
              </button>
              <button
                className="btn-confirm-cancel"
                onClick={() => setShowCleanupConfirm(false)}
                disabled={cleanupLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
