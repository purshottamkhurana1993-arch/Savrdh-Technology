import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Briefcase, 
  UserCheck, 
  Lock, 
  Plus, 
  X,
  Smartphone,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import confetti from 'canvas-confetti';

interface EmployeeRosterViewProps {
  onAssignTaskToEmployee?: (employeeId: string) => void;
}

export const EmployeeRosterView: React.FC<EmployeeRosterViewProps> = ({ onAssignTaskToEmployee }) => {
  const { 
    currentTenant, 
    currentUser, 
    users, 
    addEmployee, 
    removeEmployee, 
    updateEmployeeStatus,
    showToast 
  } = useApp();

  // Strict Tenant Isolation: Only filter employees belonging to the current tenant company
  const companyEmployees = users.filter(u => u.tenantId === currentTenant.id);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Add Employee Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [employeeCode, setEmployeeCode] = useState(`${currentTenant.code}-FLD-${100 + companyEmployees.length + 1}`);
  const [designation, setDesignation] = useState('Field Area Officer');
  const [department, setDepartment] = useState('Field Operations');
  const [branch, setBranch] = useState(currentTenant.billingAddress.split(',')[0] || 'Main Hub');
  const [role, setRole] = useState<UserRole>('employee');

  // Delete Confirmation Modal State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filtered list
  const filteredEmployees = companyEmployees.filter(emp => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (emp.designation && emp.designation.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesDept;
  });

  const departments = Array.from(new Set(companyEmployees.map(e => e.department).filter(Boolean))) as string[];

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      showToast('⚠️ Please fill in all required employee fields.');
      return;
    }

    const success = addEmployee({
      tenantId: currentTenant.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      employeeCode: employeeCode.trim() || `${currentTenant.code}-EMP-${Date.now().toString().slice(-4)}`,
      designation: designation.trim() || 'Field Officer',
      department: department.trim() || 'Operations',
      branch: branch.trim() || 'Regional Office',
      role,
      status: 'active',
      reportingManagerId: currentUser.id
    });

    if (success) {
      try { confetti({ particleCount: 50, spread: 60 }); } catch (err) {}
      setShowAddModal(false);
      // Reset form
      setFullName('');
      setPhone('');
      setEmail('');
      setEmployeeCode(`${currentTenant.code}-FLD-${100 + companyEmployees.length + 2}`);
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    removeEmployee(userToDelete.id);
    setUserToDelete(null);
  };

  const seatUtilizationPercent = Math.min(100, Math.round((companyEmployees.length / currentTenant.maxEmployees) * 100));

  return (
    <div className="space-y-6">
      
      {/* 1. Header & License Seat Capacity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {currentTenant.name} • Employee & User Roster
                </h2>
                <p className="text-xs text-slate-500">
                  Strictly isolated to your company tenant. Add field officers, assign app access roles, and manage credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Seat Progress Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 min-w-[220px]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Workforce License:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {companyEmployees.length} / {currentTenant.maxEmployees} Seats
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    seatUtilizationPercent > 90 ? 'bg-rose-500' : seatUtilizationPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${seatUtilizationPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                {currentTenant.maxEmployees - companyEmployees.length} seats available on {currentTenant.plan} Plan
              </span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, phone (+91), email, or code..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="all">All Roles</option>
            <option value="employee">Field Officers</option>
            <option value="company_manager">Managers</option>
            <option value="company_hr">HR & Compliance</option>
            <option value="company_owner">Company Admins</option>
          </select>

          {/* Department Filter */}
          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

      </div>

      {/* 3. Employee Roster Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
            <span>Employees in {currentTenant.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
              {filteredEmployees.length} of {companyEmployees.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Tenant Code: <strong className="text-slate-800 font-mono">{currentTenant.code}</strong>
          </span>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No employees match your search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search criteria or add a new employee to this company tenant roster.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); setDepartmentFilter('all'); }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Role & Designation</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Department & Hub</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const isCurrentLoggedUser = emp.id === currentUser.id;
                  const isOwner = emp.role === 'company_owner';

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Name & Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                            emp.role === 'company_owner' ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' :
                            emp.role === 'company_hr' ? 'bg-gradient-to-tr from-pink-600 to-rose-500' :
                            emp.role === 'company_manager' ? 'bg-gradient-to-tr from-blue-600 to-cyan-600' :
                            'bg-gradient-to-tr from-emerald-600 to-teal-500'
                          }`}>
                            {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {emp.fullName}
                              {isCurrentLoggedUser && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {emp.employeeCode || 'FLD-PENDING'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Designation & Role */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{emp.designation || 'Field Representative'}</div>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          emp.role === 'company_owner' ? 'bg-purple-100 text-purple-800' :
                          emp.role === 'company_hr' ? 'bg-pink-100 text-pink-800' :
                          emp.role === 'company_manager' ? 'bg-blue-100 text-blue-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {emp.role.replace('company_', '').replace('_', ' ')}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{emp.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[160px]">{emp.email}</span>
                        </div>
                      </td>

                      {/* Department & Branch */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{emp.department || 'Operations'}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{emp.branch || 'Main Hub'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            if (isOwner) {
                              showToast('⚠️ Primary Administrator cannot be deactivated.');
                              return;
                            }
                            updateEmployeeStatus(emp.id, emp.status === 'active' ? 'inactive' : 'active');
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                            emp.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                          <span className="capitalize">{emp.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {emp.role === 'employee' && onAssignTaskToEmployee && (
                            <button
                              onClick={() => onAssignTaskToEmployee(emp.id)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                              title="Assign Task to this employee"
                            >
                              Assign Task
                            </button>
                          )}

                          {!isOwner && (
                            <button
                              onClick={() => setUserToDelete(emp)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Remove / Deactivate employee from company"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD NEW EMPLOYEE */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Team Member / Officer</h3>
                  <p className="text-xs text-slate-500">
                    Company: <strong className="text-slate-800">{currentTenant.name}</strong> ({currentTenant.code})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
              
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (OTP Login) *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Work Email & Employee Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@akbspoultry.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee Code *</label>
                  <input
                    type="text"
                    required
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    placeholder="AKBS-FLD-106"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Designation & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Field Area Officer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Distribution & Sales"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Branch Hub & System Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Hub Station</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Gurugram HQ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">System Access Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-hidden"
                  >
                    <option value="employee">Field Officer (Mobile PWA & Punch)</option>
                    <option value="company_manager">Branch Manager (Task & Expense Approver)</option>
                    <option value="company_hr">HR & Compliance Officer</option>
                  </select>
                </div>
              </div>

              {/* Informational Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
                <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Once registered, this employee can immediately log in to the FieldSure PWA using their phone number and OTP.
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  Add Employee to Company
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: CONFIRM EMPLOYEE REMOVAL */}
      {/* ========================================================================= */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl border border-slate-200">
            
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Remove Employee from Company?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to remove <strong>{userToDelete.fullName}</strong> ({userToDelete.employeeCode}) from <strong>{currentTenant.name}</strong>?
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 space-y-1">
              <p className="font-semibold">⚠️ Access Revocation Notice:</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                <li>Active PWA mobile sessions will be immediately terminated.</li>
                <li>Workforce seat will be freed in your company license.</li>
                <li>Historical attendance & duty logs remain preserved in the audit trail.</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Yes, Remove Employee
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
