// components/Layout.jsx
import { useState } from 'react';
import { MdDashboard, MdEmail, MdCalendarToday, MdMenu, MdChevronRight, MdAdd } from 'react-icons/md';
import { FaCog, FaPowerOff } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import LogoutButton from '../../app/LogoutButton';

const Layout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // List of items that should show + when collapsed
  const plusItems = ['formations', 'formateurs', 'animateurs', 'cdc', 'drif'];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-white ${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && <div className="text-xl font-bold text-blue-600">Dashboard</div>}
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isCollapsed ? <MdChevronRight size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        <nav className="px-2 py-2 space-y-2">
          <Link to="/dashboard">
            <SidebarItem 
              icon={<MdDashboard />} 
              label="Dashboard" 
              active={location.pathname === '/dashboard'} 
              isCollapsed={isCollapsed}
            />
          </Link>
          <Link to="/formations">
            <SidebarItem 
              icon={isCollapsed ? <MdAdd /> : null}
              label="Formations" 
              active={location.pathname === '/formations'} 
              isCollapsed={isCollapsed}
              showPlus={isCollapsed}
            />
          </Link>
          <Link to="/formateurs">
            <SidebarItem 
              icon={isCollapsed ? <MdAdd /> : null}
              label="Formateurs" 
              active={location.pathname === '/formateurs'} 
              isCollapsed={isCollapsed}
              showPlus={isCollapsed}
            />
          </Link>
          <Link to="/animateurs">
            <SidebarItem 
              icon={isCollapsed ? <MdAdd /> : null}
              label="Animateurs" 
              active={location.pathname === '/animateurs'} 
              isCollapsed={isCollapsed}
              showPlus={isCollapsed}
            />
          </Link>
          <Link to="/cdc">
            <SidebarItem 
              icon={isCollapsed ? <MdAdd /> : null}
              label="CDC" 
              active={location.pathname === '/cdc'} 
              isCollapsed={isCollapsed}
              showPlus={isCollapsed}
            />
          </Link>
          <Link to="/drif">
            <SidebarItem 
              icon={isCollapsed ? <MdAdd /> : null}
              label="DRIF" 
              active={location.pathname === '/drif'} 
              isCollapsed={isCollapsed}
              showPlus={isCollapsed}
            />
          </Link>
          <Link to="/inbox">
            <SidebarItem 
              icon={<MdEmail />} 
              label="Inbox" 
              active={location.pathname === '/inbox'} 
              isCollapsed={isCollapsed}
            />
          </Link>
          <Link to="/calendar">
            <SidebarItem 
              icon={<MdCalendarToday />} 
              label="Calender" 
              active={location.pathname === '/calendar'} 
              isCollapsed={isCollapsed}
            />
          </Link>
          <Link to="/settings">
            <SidebarItem 
              icon={<FaCog />} 
              label="Settings" 
              active={location.pathname === '/settings'} 
              isCollapsed={isCollapsed}
            />
          </Link>
          <LogoutButton isCollapsed={isCollapsed} iconOnly={isCollapsed} />
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-6 overflow-y-auto bg-gray-50  transition-all duration-300 ease-in-out`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;