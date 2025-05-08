// components/Layout.jsx
import { MdDashboard, MdEmail, MdCalendarToday } from 'react-icons/md';
import { FaCog, FaPowerOff } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import LogoutButton from '../../app/LogoutButton';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-white w-full md:w-64 border-r border-gray-200 flex-shrink-0">
        <div className="p-4 text-xl font-bold text-blue-600">Dashboard</div>
        <nav className="px-4 py-2 space-y-2">
          <Link to="/dashboard"><SidebarItem icon={<MdDashboard />} label="Dashboard" active={location.pathname === '/dashboard'} /></Link>
          <Link to="/formations"><SidebarItem label="Formations" active={location.pathname === '/formations'} /></Link>
          <Link to="/formateurs"><SidebarItem label="Formateurs" active={location.pathname === '/formateurs'} /></Link>
          <Link to="/animateurs"><SidebarItem label="Animateurs" active={location.pathname === '/animateurs'} /></Link>
          <Link to="/cdc"><SidebarItem label="CDC" active={location.pathname === '/cdc'} /></Link>
          <Link to="/drif"><SidebarItem label="DRIF" active={location.pathname === '/drif'} /></Link>
          <Link to="/inbox"><SidebarItem icon={<MdEmail />} label="Inbox" active={location.pathname === '/inbox'} /></Link>
          <Link to="/calendar"><SidebarItem icon={<MdCalendarToday />} label="Calender" active={location.pathname === '/calendar'} /></Link>
          <Link to="/settings"><SidebarItem icon={<FaCog />} label="Settings" active={location.pathname === '/settings'} /></Link>
          <LogoutButton />
          </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
