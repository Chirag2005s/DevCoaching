import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, mobileOpen, onMenuClick, onClose }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="dashboard-layout" data-theme={theme}>
      <Sidebar mobileOpen={mobileOpen} onClose={onClose} />
      <div className="main-content">
        <Navbar onMenuClick={onMenuClick} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
