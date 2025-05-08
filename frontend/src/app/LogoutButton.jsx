import { useDispatch } from 'react-redux';
import { logoutUser } from './authSlice'; 
import { useNavigate } from 'react-router-dom';
import SidebarItem from '../Components/Dashboard/SidebarItem';
import { FaPowerOff } from 'react-icons/fa';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());            
    navigate('/');           
  };

  return (
    <div onClick={handleLogout} className="cursor-pointer">
      <SidebarItem icon={<FaPowerOff />} label="Logout" />
    </div>
  );
};

export default LogoutButton;
