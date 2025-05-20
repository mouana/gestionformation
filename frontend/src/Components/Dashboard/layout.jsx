import { useState } from 'react';
import { MdDashboard, MdCalendarToday, MdMenu, MdChevronRight, MdAdd } from 'react-icons/md';
import { FiBook } from 'react-icons/fi';
import { FaCog } from 'react-icons/fa';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SidebarItem from './SidebarItem';
import LogoutButton from '../../app/LogoutButton';
import { GiNotebook  } from 'react-icons/gi';

const Layout = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, role, loading } = useSelector((state) => state.auth);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getCurrentRole = () => {
    return user?.role || role || localStorage.getItem('role');
  };

  const renderSidebarItems = () => {
    const currentRole = getCurrentRole();
    
    if (!currentRole) {
      return null;
    }

    switch(currentRole) {
      case 'admin':
        return (
          <>
            <Link to="/dashboard">
              <SidebarItem 
                icon={<MdDashboard />} 
                label="Dashboard" 
                active={location.pathname === '/dashboard'} 
                isCollapsed={isCollapsed}
              />
            </Link>
            <Link to="/cdc">
              <SidebarItem 
                icon={isCollapsed ? <MdAdd /> : <MdAdd />}
                label="CDC" 
                active={location.pathname === '/cdc'} 
                isCollapsed={isCollapsed}
                showPlus={isCollapsed}
              />
            </Link>
            <Link to="/drif">
              <SidebarItem 
                icon={isCollapsed ? <MdAdd /> : <MdAdd />}
                label="DRIF" 
                active={location.pathname === '/drif'} 
                isCollapsed={isCollapsed}
                showPlus={isCollapsed}
              />
            </Link>
            <Link to="/animateurs">
              <SidebarItem 
                icon={isCollapsed ? <MdAdd /> : <MdAdd />}
                label="Animateurs" 
                active={location.pathname === '/animateurs'} 
                isCollapsed={isCollapsed}
                showPlus={isCollapsed}
              />
            </Link>
             <Link to="/formateurs">
              <SidebarItem 
                icon={isCollapsed ? <MdAdd /> : <MdAdd />}
                label="Participants" 
                active={location.pathname === '/formateurs'} 
                isCollapsed={isCollapsed}
                showPlus={isCollapsed}
              />
            </Link>
          </>
        );
      case 'responsable_drif':
        return(
          <>
          <Link to="/dashboard">
              <SidebarItem 
                icon={<MdDashboard />} 
                label="Dashboard" 
                active={location.pathname === '/dashboard'} 
                isCollapsed={isCollapsed}
              />
            </Link>
            <Link to="/formation">
              <SidebarItem 
                icon={isCollapsed ? <GiNotebook /> : <GiNotebook />}
                label="Formations" 
                active={location.pathname === '/formation'} 
                isCollapsed={isCollapsed}
                showPlus={isCollapsed}
              />
            </Link>
          </>
        );
      case 'responsable_cdc':
        return (
          <>
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
                icon={isCollapsed ? <GiNotebook /> : <GiNotebook />}
                label="Formations" 
                active={location.pathname === '/formations'} 
                isCollapsed={isCollapsed}
                showPlus={isCollapsed}
              />
            </Link>
            <Link to="/cour">
              <SidebarItem 
                icon={<FiBook />} 
                // icon={isCollapsed ? <FiBook /> : null}
                label="Cours" 
                active={location.pathname === '/cour'} 
                isCollapsed={isCollapsed}
                // showPlus={isCollapsed}
              />
            </Link>
          </>
        );
      case 'formateur_animateur':
        return (
          <>
            <Link to="/AnimDashboard">
              <SidebarItem 
                icon={<MdDashboard />} 
                label="Dashboard" 
                active={location.pathname === '/AnimDashboard'} 
                isCollapsed={isCollapsed}
              />
            </Link>
            <Link to="/coursList">
              <SidebarItem 
                icon={<FiBook />} 
                // icon={isCollapsed ? <FiBook /> : null}
                label="Cours" 
                active={location.pathname === '/coursList'} 
                isCollapsed={isCollapsed}
                // showPlus={isCollapsed}
              />
            </Link>
            <Link to="/calendar">
            <SidebarItem 
              icon={<MdCalendarToday />} 
              label="Calendar" 
              active={location.pathname === '/calendar'} 
              isCollapsed={isCollapsed}
            />
          </Link>
          </>
        );
      case 'formateur_participant':
        return (<>
          <Link to="/participantdashboard">
            <SidebarItem 
              icon={<MdDashboard />} 
              label="Dashboard"
              active={location.pathname === '/participantdashboard'}
              isCollapsed={isCollapsed}
            />
          </Link>
          <Link to="/calendar">
            <SidebarItem 
              icon={<MdCalendarToday />} 
              label="Calendar" 
              active={location.pathname === '/calendar'} 
              isCollapsed={isCollapsed}
            />
          </Link>
        </>
          
        );
      default:
        return null;
    }
  };

  if (!loading && !getCurrentRole()) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-white ${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && <div className="text-xl font-bold text-blue-600">Dashboard</div>}
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <MdChevronRight size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        <nav className="px-2 py-2 space-y-2">
          {renderSidebarItems()}
          
          {/* <Link to="/inbox">
            <SidebarItem 
              icon={<MdEmail />} 
              label="Inbox" 
              active={location.pathname === '/inbox'} 
              isCollapsed={isCollapsed}
            />
          </Link> */}
          
          {/* {getCurrentRole() !== 'formateur_participant' && (
            <Link to="/settings">
              <SidebarItem 
                icon={<FaCog />} 
                label="Settings" 
                active={location.pathname === '/settings'} 
                isCollapsed={isCollapsed}
              />
            </Link>
          )} */}
          <LogoutButton isCollapsed={isCollapsed} iconOnly={isCollapsed} />
        </nav>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-6 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;