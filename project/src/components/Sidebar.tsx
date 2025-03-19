import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Users, FileText, LogOut } from 'lucide-react';

interface SidebarProps {
  onSearch: (term: string) => void;
}

function Sidebar({ onSearch }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className=" w- bg-[#463C6F] text-white p-4 flex flex-col h-screen">
      <div className="flex items-center mb-1">
    
    <img src="/Dashboard.svg" alt="Logo" className="w-30 h-10" />

</div>

<div className="relative mb-2">
  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
  <input
    type="text"
    placeholder="Search"
    className="w-full pl-10 pr-4 py-2 bg-[#574D84] rounded-md focus:outline-none"
    onChange={(e) => onSearch(e.target.value)}
  />
</div>

<nav className="space-y-2 flex-grow">
  <button
    onClick={() => navigate('/dashboard')}
    className={`flex items-center space-x-2 w-full p-2  ${
      location.pathname === '/dashboard' ? 'bg-[#574D84]' : 'hover:bg-[#574D84]'
    } rounded-md`}
  >
    <Users className="h-5 w-5" />
    <span>Users</span>
  </button>
  <button
    onClick={() => navigate('/form')}
    className={`flex items-center space-x-2 w-full p-2 ${
      location.pathname === '/form' ? 'bg-[#574D84]' : 'hover:bg-[#574D84]'
    } rounded-md`}
  >
    <FileText className="h-5 w-5" />
    <span>Form</span>
  </button>
</nav>

<div className="mt-auto">
  <button
    onClick={handleLogout}
    className="flex items-center w-full p-2 bg-[#574D84] rounded-md hover:bg-[#6A5F9C]"
  >
    <img
      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
      alt="Profile"
      className="w-8 h-8 rounded-full"
    />
    <span className="ml-3">{userName}</span>
    <LogOut className="h-5 w-5 ml-auto" />
  </button>
</div>
    </div>
  );
}

export default Sidebar;
{/* <span className="ml-2 text-xl font-bold">NexaAdmin</span> */}