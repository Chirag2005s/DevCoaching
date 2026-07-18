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
  UserPlus
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
    topDevice: 'Desktop'
  });
  const [pagination, setPagination] = useState({
    totalLogs: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retention cleanup state
  const [cleanupDays, setCleanupDays] = useState(30);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [cleanupMessage, setCleanupMessage] = useState('');

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
          status
        }
      });
      setLogs(response.data.logs || []);
      setPagination(response.data.pagination || { totalLogs: 0, totalPages: 1, currentPage: 1 });
      setStats(response.data.stats || { totalLoginsToday: 0, failedLoginsToday: 0, registrationsToday: 0, topDevice: 'Desktop' });
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
    try {
      const response = await api.delete('/access-logs/cleanup', {
        data: { days: cleanupDays }
      });
      setCleanupMessage(response.data.message);
      setShowCleanupConfirm(false);
      // Refresh logs
      fetchLogs();
    } catch (err) {
      console.error(err);
      setCleanupMessage(err.response?.data?.message || 'Failed to clean up logs');
    } finally {
      setCleanupLoading(false);
      setTimeout(() => setCleanupMessage(''), 5000);
    }
  };

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'Desktop':
        return <Monitor size={16} />;
      case 'Mobile':
        return <Smartphone size={16} />;
      case 'Tablet':
        return <Tablet size={16} />;
      default:
        return <HelpCircle size={16} />;
    }
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

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dateStr;
    }
  };

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-top">
        <div className="page-top-left">
          <h1>Admin User Access Logs</h1>
          <p>Monitor security events, login attempts, registrations, and active session devices.</p>
        </div>
      </div>

      {/* Audit Summary Statistics Bar */}
      <div className="stats-grid-4">
        <div className="summary-pill stat-card-premium">
          <div className="stat-card-icon sc-blue">
            <LogIn size={20} />
          </div>
          <div className="stat-card-content">
            <span className="pill-label">Total Logins Today</span>
            <span className="pill-value">{stats.totalLoginsToday}</span>
          </div>
        </div>

        <div className="summary-pill stat-card-premium">
          <div className="stat-card-icon sc-red">
            <ShieldAlert size={20} />
          </div>
          <div className="stat-card-content">
            <span className="pill-label">Failed Logins Today</span>
            <span className="pill-value text-danger">{stats.failedLoginsToday}</span>
          </div>
        </div>

        <div className="summary-pill stat-card-premium">
          <div className="stat-card-icon sc-purple">
            <UserPlus size={20} />
          </div>
          <div className="stat-card-content">
            <span className="pill-label">Registrations Today</span>
            <span className="pill-value">{stats.registrationsToday}</span>
          </div>
        </div>

        <div className="summary-pill stat-card-premium">
          <div className="stat-card-icon sc-amber">
            <Monitor size={20} />
          </div>
          <div className="stat-card-content">
            <span className="pill-label">Top Device Type</span>
            <span className="pill-value">{stats.topDevice}</span>
          </div>
        </div>
      </div>

      {/* Clean-up status banner if success */}
      {cleanupMessage && (
        <div className="cleanup-banner alert-pill">
          <AlertCircle size={18} />
          <span>{cleanupMessage}</span>
        </div>
      )}

      {/* Control Bar (Filters + SuperAdmin Actions) */}
      <div className="filters-container-premium">
        <div className="filters-left">
          {/* Search bar */}
          <div className="search-input-wrap">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by name, email, or IP..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Action Filter */}
          <div className="filter-dropdown-wrap">
            <select 
              className="filter-select-premium" 
              value={action} 
              onChange={(e) => { setAction(e.target.value); setPage(1); }}
            >
              <option value="">All Actions</option>
              <option value="login">Logins</option>
              <option value="registration">Registrations</option>
              <option value="logout">Logouts</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-dropdown-wrap">
            <select 
              className="filter-select-premium" 
              value={status} 
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Superadmin Retention Actions */}
        {isSuperAdmin && (
          <div className="filters-right">
            <div className="retention-control">
              <select 
                className="filter-select-premium select-retention" 
                value={cleanupDays} 
                onChange={(e) => setCleanupDays(parseInt(e.target.value))}
              >
                <option value={30}>Older than 30 Days</option>
                <option value={60}>Older than 60 Days</option>
                <option value={90}>Older than 90 Days</option>
              </select>
              <button 
                className="btn-danger-sm flex-center gap-6"
                onClick={() => setShowCleanupConfirm(true)}
              >
                <Trash2 size={16} />
                <span>Clean Logs</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="table-card">
        {loading ? (
          <div className="state-box">
            <Activity className="state-spin text-accent" size={36} />
            <h3>Fetching access logs...</h3>
            <p>Gathering logs from database.</p>
          </div>
        ) : error ? (
          <div className="state-box text-danger">
            <AlertCircle size={36} />
            <h3>Error loading logs</h3>
            <p>{error}</p>
            <button className="btn-primary-sm mt-12" onClick={fetchLogs}>Try Again</button>
          </div>
        ) : logs.length === 0 ? (
          <div className="state-box">
            <Activity size={36} />
            <h3>No Access Logs Found</h3>
            <p>No log records matched your query parameters.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Action</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Device</th>
                <th>User Agent</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <div className="user-cell">
                      <div className={`user-avatar sm ${log.status === 'failed' ? 'red' : 'green'}`}>
                        {(log.name ? log.name.charAt(0) : log.email.charAt(0)).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{log.name || 'Unknown User'}</span>
                        <span className="user-email">{log.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-pill ${getActionBadgeClass(log.action)}`}>
                      <span className="bp-dot" />
                      {log.action === 'login' ? 'Login' : log.action === 'registration' ? 'Register' : 'Logout'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span className={`badge-pill ${log.status === 'success' ? 'bp-green' : 'bp-red'}`}>
                        <span className="bp-dot" />
                        {log.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                      {log.status === 'failed' && log.reason && (
                        <span className="failure-reason-lbl">
                          {log.reason.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="ip-cell-text">{log.ipAddress || 'Unknown IP'}</span>
                  </td>
                  <td>
                    <div className="device-cell-wrapper">
                      {getDeviceIcon(log.deviceType)}
                      <span>{log.deviceType}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ua-cell-wrapper" title={log.userAgent}>
                      {log.userAgent ? log.userAgent.split(' ')[0] : 'Unknown'}
                    </div>
                  </td>
                  <td>
                    <span className="date-cell-text">{formatDate(log.createdAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && !error && logs.length > 0 && (
        <div className="pagination-wrapper-premium">
          <span className="pagination-count">
            Showing Page <strong>{pagination.currentPage}</strong> of <strong>{pagination.totalPages}</strong> ({pagination.totalLogs} total logs)
          </span>
          <div className="pagination-actions">
            <button 
              className="btn-icon-sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button 
              className="btn-icon-sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Superadmin Retention Confirmation Modal */}
      {showCleanupConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box modal-premium">
            <div className="confirm-header-icon text-danger">
              <Trash2 size={40} />
            </div>
            <h3>Perform Log Deletion?</h3>
            <p>
              Are you sure you want to clean up logs older than <strong>{cleanupDays} days</strong>? 
              This action is permanent and cannot be undone.
            </p>
            <div className="confirm-actions">
              <button 
                className="btn-confirm-del btn-danger-action"
                onClick={handleCleanup}
                disabled={cleanupLoading}
              >
                {cleanupLoading ? 'Clearing...' : 'Confirm Deletion'}
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
