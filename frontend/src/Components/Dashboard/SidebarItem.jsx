const SidebarItem = ({ icon, label, active }) => {
    return (
      <div className={`flex items-center gap-3 px-4 py-2 rounded cursor-pointer 
        ${active ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
        {icon}
        <span>{label}</span>
      </div>
    );
  };
  
  export default SidebarItem;
  