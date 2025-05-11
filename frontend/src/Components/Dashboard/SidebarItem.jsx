import { MdAdd } from 'react-icons/md';
const SidebarItem = ({ icon, label, active, isCollapsed, showPlus }) => {
  return (
    <div className={`flex items-center p-2 rounded-lg ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
      {showPlus ? (
        <span className="text-xl"><MdAdd /></span>
      ) : icon ? (
        <>
          <span className="text-xl">{icon}</span>
          {!isCollapsed && <span className="ml-3">{label}</span>}
        </>
      ) : (
        <>
          {!isCollapsed && <span>{label}</span>}
          {isCollapsed && <span className="text-xl"><MdAdd /></span>}
        </>
      )}
    </div>
  );
};

export default SidebarItem;