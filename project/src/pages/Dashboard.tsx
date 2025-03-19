// frontend/src/Dashboard.js
import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { useNavigate } from 'react-router-dom';
import { BellIcon, PencilIcon, Trash2Icon, MenuIcon } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

interface Employee {
  id: number;
  name: string;
  role: string;
  age: string;
  image: string;
  gender: string;
}

const professions = [
  'Software Developer',
  'Senior Auditor',
  'Structural Engineer',
  'Accounting Director',
  'DevOps Engineer',
  'UX Designer',
  'Data Scientist',
  'Product Manager',
  'Marketing Specialist',
  'HR Manager'
];

function Dashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null); // Ref for sidebar container

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term === '') {
      fetchEmployees();
    } else {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(term.toLowerCase()) ||
        employee.role.toLowerCase().includes(term.toLowerCase())
      );
      setEmployees(filtered);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:3001/employees/${id}`);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (err) {
        setError('Failed to delete employee');
        console.error(err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      try {
        const response = await axios.put(
          `http://localhost:3001/employees/${editingEmployee.id}`,
          editingEmployee
        );
        setEmployees(employees.map(emp =>
          emp.id === editingEmployee.id ? response.data : emp
        ));
        setEditingEmployee(null);
      } catch (err) {
        setError('Failed to update employee');
        console.error(err);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#463C6F]">
      <div className="md:hidden flex justify-between items-center p-4 bg-[#463C6F]">
        <button onClick={toggleSidebar} className="text-white">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-white text-xl font-semibold">Dashboard</h1>
        <button className="p-2 rounded-full hover:bg-[#574D84] text-white">
          <BellIcon className="h-6 w-6" />
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed md:static inset-y-0 left-0 z-50 w-64 md:w-auto bg-[#463C6F] transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onSearch={handleSearch} />
      </div>

      <div className="flex-1 relative overflow-y-auto">
        <div className="absolute inset-0 bg-white rounded-tl-[36px] md:rounded-tl-[36px] m-2 md:m-5 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8">
            <div className="hidden md:block">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Welcome back, {localStorage.getItem('userName')}</h1>
              <p className="text-gray-600 text-sm md:text-base">Track, manage and handle your Employee.</p>
            </div>
            <button className="hidden md:block p-2 rounded-full hover:bg-gray-100">
              <BellIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {error && <div className="text-red-600 mb-4 text-sm md:text-base">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {employees.map((employee) => (
              <div key={employee.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="w-full h-32 sm:h-48 object-cover"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{employee.name}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{employee.role}</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        {employee.age} Years, {employee.gender}
                      </p>
                    </div>
                    <div className="flex space-x-1 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <PencilIcon className="h-4 md:h-5 w-4 md:w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2Icon className="h-4 md:h-5 w-4 md:w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md sm:max-w-lg md:max-w-xl">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-semibold">Edit Employee</h2>
                  <button onClick={() => setEditingEmployee(null)} className="text-gray-500 text-lg md:text-xl">
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={editingEmployee.name}
                      onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profession</label>
                    <select
                      value={editingEmployee.role}
                      onChange={(e) => setEditingEmployee({...editingEmployee, role: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm md:text-base"
                    >
                      {professions.map((profession) => (
                        <option key={profession} value={profession}>
                          {profession}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        value={editingEmployee.age}
                        onChange={(e) => setEditingEmployee({...editingEmployee, age: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={editingEmployee.gender}
                        onChange={(e) => setEditingEmployee({...editingEmployee, gender: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm md:text-base"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm md:text-base"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;