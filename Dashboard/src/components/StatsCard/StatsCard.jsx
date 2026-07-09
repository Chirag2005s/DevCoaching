import './StatsCard.css';

/**
 * StatsCard – reusable metric card widget.
 * @param {string} title
 * @param {string|number} value
 * @param {ReactNode} icon
 * @param {string} color – CSS var or hex for accent colour
 * @param {string} trend – e.g. "+12%" (optional)
 * @param {string} trendLabel – e.g. "vs last month"
 * @param {boolean} positive – true = green trend, false = red
 */
const StatsCard = ({ title, value, icon, color = 'var(--brand-primary)', trend, trendLabel, positive = true }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div className="stats-card-info">
          <p className="stats-card-title">{title}</p>
          <h3 className="stats-card-value">{value}</h3>
          {trend && (
            <div className={`stats-card-trend ${positive ? 'positive' : 'negative'}`}>
              <span className="trend-arrow">{positive ? '↑' : '↓'}</span>
              <span className="trend-value">{trend}</span>
              {trendLabel && <span className="trend-label">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className="stats-card-icon" style={{ '--icon-color': color }}>
          {icon}
        </div>
      </div>
      <div className="stats-card-bar">
        <div className="stats-card-bar-fill" style={{ background: color }} />
      </div>
    </div>
  );
};

export default StatsCard;
