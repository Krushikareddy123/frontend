import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { PencilIcon, Trash2Icon, MenuIcon } from 'lucide-react';
import axios from 'axios';

interface Employee {
  id: number;
  name: string;
  profession: string;
  dateOfBirth: string;
  gender: string;
  image?: string;
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

function FormPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    dateOfBirth: '',
    gender: '',
    image: null as File | null
  });
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('profession', formData.profession);
    data.append('dateOfBirth', formData.dateOfBirth);
    data.append('gender', formData.gender);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingEmployee) {
        const response = await axios.put(
          `http://localhost:3001/employees/${editingEmployee.id}`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setEmployees(employees.map(emp =>
          emp.id === editingEmployee.id ? response.data : emp
        ));
        setEditingEmployee(null);
      } else {
        const response = await axios.post('http://localhost:3001/employees', data, {
          headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setEmployees([...employees, response.data]);
      }
      setFormData({
        name: '',
        profession: '',
        dateOfBirth: '',
        gender: '',
        image: null
      });
    } catch (err) {
      setError('Failed to save employee');
      console.error(err);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      profession: employee.profession,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      image: null
    });
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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#463C6F]">
      {/* Hamburger Menu for mobile */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#463C6F] border-b border-[#574D84]">
        <button onClick={toggleSidebar} className="text-white">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold text-white">Employee Form</h1>
        <div className="w-6" />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'block' : 'hidden'} md:block fixed md:static inset-y-0 left-0 z-50 w-64 md:w-auto bg-[#463C6F] transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onSearch={handleSearch} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-tl-[36px] m-2 md:m-5 p-4 md:p-6 min-h-screen">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-gray-900">
            Enter the detail of your Employee
          </h1>

          {error && <div className="text-red-600 mb-4 text-sm md:text-base">{error}</div>}

          <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter Full Name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profession</label>
                  <select
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm"
                    required
                  >
                    <option value="">Select Profession</option>
                    {professions.map((profession) => (
                      <option key={profession} value={profession}>
                        {profession}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 text-sm"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {editingEmployee && formData.image && (
                  <p className="mt-1 text-sm text-gray-600">New image selected</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-[#463C6F] text-white rounded-md hover:bg-[#574D84] text-sm"
                >
                  {editingEmployee ? 'Update' : 'Submit'}
                </button>
                {editingEmployee && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEmployee(null);
                      setFormData({
                        name: '',
                        profession: '',
                        dateOfBirth: '',
                        gender: '',
                        image: null
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Filters, Search, and Table */}
            <div className="mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button className="w-full sm:w-auto px-4 py-2 bg-[#463C6F] text-white rounded-md hover:bg-[#574D84] text-sm">
                  More filters
                </button>
                <input
                  type="text"
                  placeholder="Search employees"
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md text-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                  <thead className="bg-[#F9FAFB]">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sl No</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Profession</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.map((employee, index) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-sm">{index + 1}</td>
                        <td className="px-3 py-2 text-sm">{employee.name}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {employee.profession}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm">{employee.dateOfBirth}</td>
                        <td className="px-3 py-2 text-sm">{employee.gender}</td>
                        <td className="px-3 py-2 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <PencilIcon className="h-4 w-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2Icon className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row justify-between items-center gap-2 bg-[#F9FAFB] p-2 rounded-b-lg">
                <button className="w-full sm:w-auto px-4 py-2 bg-[#463C6F] text-white rounded-md hover:bg-[#574D84] text-sm">
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page 1 of {Math.ceil(filteredEmployees.length / 10)}
                </span>
                <button className="w-full sm:w-auto px-4 py-2 bg-[#463C6F] text-white rounded-md hover:bg-[#574D84] text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormPage;