import { useDispatch } from 'react-redux';
import { logoutUser } from './authSlice'; 
import { useNavigate } from 'react-router-dom';
import SidebarItem from '../Components/Dashboard/SidebarItem';
import { FaPowerOff } from 'react-icons/fa';

const LogoutButton = ({ isCollapsed, iconOnly }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());            
    navigate('/');           
  };

  return (
    <div onClick={handleLogout} className="cursor-pointer">
         <button className={`flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full`}>
      <FaPowerOff className="text-xl" />
      {!iconOnly && <span className="ml-3">Logout</span>}
    </button>
    </div>
  );
};

export default LogoutButton;
