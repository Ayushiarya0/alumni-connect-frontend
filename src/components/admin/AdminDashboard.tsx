import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  GraduationCap,
  Building2,
  Search,
  Filter,
  AlertTriangle,
  Ban,
  Check,
  Sparkles,
  BarChart3,
  Layers,
  FileText,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  Award
} from 'lucide-react';
import { ADMIN_ANALYTICS, UNIVERSITIES } from '../../data/mockData';
import { AlumniProfile } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    alumniList,
    connections,
    mentorships,
    approveAlumniProfile,
    rejectAlumniProfile,
    requestMoreInfoAlumni,
    toggleUserSuspension,
    currentUser,
    isAuthenticated,
    switchUserRole,
    setAuthModalOpen,
    setAuthModalMode,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'verification_center' | 'user_management' | 'alumni_management' | 'university_management' | 'connections' | 'mentorships' | 'reports' | 'analytics'
  >('verification_center');

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [requestNoteModalAlumni, setRequestNoteModalAlumni] = useState<AlumniProfile | null>(null);
  const [moreInfoNote, setMoreInfoNote] = useState('');

  if (!isAuthenticated || currentUser.role !== 'admin') {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-[#F8F9FA] py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 shadow-card-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Restricted Area
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-3">
              Platform Admin Clearance Required
            </h2>
            <p className="text-gray-600 text-xs mt-2 leading-relaxed">
              The moderation command center, alumni verification dossier review, and university management are restricted to platform deans and verified moderators.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                switchUserRole('admin');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Verify Dean / Moderator Session
            </button>
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Enter Institutional Credentials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending alumni verification items
  const pendingAlumni = alumniList.filter(
    a => a.verificationStatus === 'pending' || a.verificationStatus === 'under_review' || a.verificationStatus === 'info_requested'
  );

  const verifiedAlumni = alumniList.filter(a => a.verificationStatus === 'verified');

  const handleSendMoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestNoteModalAlumni) return;
    requestMoreInfoAlumni(requestNoteModalAlumni.id, moreInfoNote);
    setRequestNoteModalAlumni(null);
    setMoreInfoNote('');
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Platform Administration & Institutional Moderation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Central Admin Control Center
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Logged in as <strong className="text-gray-900">{currentUser.name}</strong> · Dean & Lead Administrator
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Network Moderation Active</span>
            </span>
          </div>
        </div>

        {/* Top 8 Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Total Students</span>
            <div className="text-xl font-extrabold text-blue-600 mt-1">{ADMIN_ANALYTICS.totalStudents.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">45 Colleges</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Total Alumni</span>
            <div className="text-xl font-extrabold text-indigo-600 mt-1">{ADMIN_ANALYTICS.totalAlumni.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">Registered</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Verified Alumni</span>
            <div className="text-xl font-extrabold text-teal-600 mt-1">{ADMIN_ANALYTICS.verifiedAlumni.toLocaleString()}</div>
            <div className="text-[10px] text-teal-600 font-medium">87.4% Passed</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Pending Alumni</span>
            <div className="text-xl font-extrabold text-amber-600 mt-1">{pendingAlumni.length + 12}</div>
            <div className="text-[10px] text-amber-600 font-medium">Needs Dossier Review</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Active Connections</span>
            <div className="text-xl font-extrabold text-gray-900 mt-1">{ADMIN_ANALYTICS.activeConnections.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">Cross-campus</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Mentorships</span>
            <div className="text-xl font-extrabold text-blue-700 mt-1">{ADMIN_ANALYTICS.mentorshipSessions.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400">Sessions booked</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Universities</span>
            <div className="text-xl font-extrabold text-slate-800 mt-1">{UNIVERSITIES.length}</div>
            <div className="text-[10px] text-gray-400">Active Partners</div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-card-soft">
            <span className="text-gray-500 text-[11px] font-semibold">Reports</span>
            <div className="text-xl font-extrabold text-teal-600 mt-1">0</div>
            <div className="text-[10px] text-teal-600 font-medium">Clean Record</div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm text-xs font-bold">
          <button
            onClick={() => setActiveTab('verification_center')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'verification_center' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verification Center</span>
            {pendingAlumni.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {pendingAlumni.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('user_management')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'user_management' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('alumni_management')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'alumni_management' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Alumni Directory
          </button>
          <button
            onClick={() => setActiveTab('university_management')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'university_management' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            University Management
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'connections' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab('mentorships')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'mentorships' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mentorships
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* 1. VERIFICATION CENTER (Main Pending Applications Dossier) */}
        {activeTab === 'verification_center' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    Pending Alumni Verification Applications
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Evaluate candidate credentials, degree certificates, employment proofs, and mentorship categories before issuing institutional verified badges.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  {pendingAlumni.length} Dossiers Pending
                </span>
              </div>

              {pendingAlumni.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-extrabold text-gray-900 text-base">Verification Queue Clear!</p>
                  <p className="mt-1">All alumni applications have been reviewed and decided.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingAlumni.map(applicant => (
                    <div
                      key={applicant.id}
                      className="p-6 rounded-3xl border-2 border-slate-100 bg-slate-50/50 shadow-xs space-y-4"
                    >
                      {/* Top Row: Applicant Profile Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-base text-gray-900">{applicant.name}</h3>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                                {applicant.verificationStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-blue-700 mt-0.5">
                              {applicant.jobTitle} @ {applicant.company}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                              <span>{applicant.university}</span>
                              <span>·</span>
                              <span>{applicant.degree} (Batch of {applicant.graduationYear})</span>
                            </div>
                          </div>
                        </div>

                        {/* Three Evaluation Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => setRequestNoteModalAlumni(applicant)}
                            className="px-3 py-2 rounded-xl border border-gray-300 hover:border-amber-400 bg-white text-gray-700 hover:text-amber-800 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Request Info</span>
                          </button>
                          <button
                            onClick={() => rejectAlumniProfile(applicant.id)}
                            className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => approveAlumniProfile(applicant.id)}
                            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Approve & Verify</span>
                          </button>
                        </div>
                      </div>

                      {/* Detailed Evaluation Dossier Table */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200 text-xs">
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                          <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider block mb-1">
                            Experience & Skills
                          </span>
                          <div className="text-gray-800 font-semibold">{applicant.experienceYears} Years Professional Experience</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {applicant.skills.map(sk => (
                              <span key={sk} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px]">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                          <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider block mb-1">
                            Mentorship Focus
                          </span>
                          <div className="text-gray-800">Available: <strong className="text-emerald-700">{applicant.availableForMentorship ? 'Yes' : 'No'}</strong></div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(applicant.mentorshipCategories || ['Technical Skills', 'Career Guidance']).map(cat => (
                              <span key={cat} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                          <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider block mb-1">
                            Submitted Documents
                          </span>
                          <div className="space-y-1.5">
                            {(applicant.submittedDocuments || [
                              { type: 'Degree Certificate', name: 'Official_Degree.pdf' },
                              { type: 'Corporate Badge', name: 'Employee_Badge.png' }
                            ]).map((doc, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] text-gray-700 bg-gray-50 px-2 py-1 rounded">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3 text-purple-600" />
                                  <span className="truncate max-w-[140px]">{doc.name}</span>
                                </span>
                                <span className="text-[10px] text-purple-600 font-bold">Inspect</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {applicant.adminNotes && (
                        <div className="text-[11px] text-gray-600 bg-white p-3 rounded-xl border border-purple-100">
                          <strong>Admin Note / History:</strong> {applicant.adminNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. USER MANAGEMENT */}
        {activeTab === 'user_management' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">User Directory & Status Moderation</h2>
                <p className="text-xs text-gray-500">Search students, alumni, and institute administrators</p>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearchTerm}
                  onChange={e => setUserSearchTerm(e.target.value)}
                  placeholder="Filter users..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:border-purple-600 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Institution</th>
                    <th className="py-3 px-4">Role / Designation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alumniList
                    .filter(a => a.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || a.company.toLowerCase().includes(userSearchTerm.toLowerCase()))
                    .map(user => (
                      <tr key={user.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-[10px] text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-800">{user.university}</td>
                        <td className="py-3 px-4 font-semibold text-purple-700">{user.jobTitle} @ {user.company}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              user.verificationStatus === 'verified'
                                ? 'bg-emerald-50 text-emerald-700'
                                : user.verificationStatus === 'suspended'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            {user.verificationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => toggleUserSuspension(user.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                              user.verificationStatus === 'suspended'
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            {user.verificationStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ALUMNI DIRECTORY MANAGEMENT */}
        {activeTab === 'alumni_management' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft space-y-4 animate-in fade-in">
            <h2 className="font-extrabold text-gray-900 text-base pb-3 border-b border-gray-100">
              Verified Alumni Roster ({verifiedAlumni.length} Active)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {verifiedAlumni.map(alumni => (
                <div key={alumni.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <img src={alumni.avatar} alt={alumni.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-xs text-gray-900">{alumni.name}</div>
                        <div className="text-[10px] text-purple-700 font-semibold">{alumni.jobTitle} @ {alumni.company}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-2 truncate">
                      {alumni.university} · Batch {alumni.graduationYear}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold">Verified Badge Active</span>
                    <button
                      onClick={() => rejectAlumniProfile(alumni.id)}
                      className="text-red-600 hover:underline"
                    >
                      Revoke Badge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. UNIVERSITY MANAGEMENT */}
        {activeTab === 'university_management' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-extrabold text-gray-900 text-base">Connected Universities & Verified Domains</h2>
              <button
                onClick={() => addToast('University onboarding request sent to Academic Board.', 'info')}
                className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
              >
                + Add University
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {UNIVERSITIES.map(u => (
                <div key={u.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50">
                  <div className="font-bold text-gray-900 text-sm">{u.name}</div>
                  <div className="text-xs text-gray-500">{u.location}, {u.state}</div>
                  <div className="mt-2 text-xs text-purple-700 font-semibold">
                    Verified Domains: <span className="font-mono text-gray-700">{u.verifiedDomains.join(', ')}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
                    <span>{u.studentCount.toLocaleString()} Students</span>
                    <span className="font-semibold text-gray-800">{u.alumniCount.toLocaleString()} Alumni</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CONNECTIONS MANAGEMENT */}
        {activeTab === 'connections' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft space-y-4 animate-in fade-in">
            <h2 className="font-extrabold text-gray-900 text-base pb-3 border-b border-gray-100">
              Cross-Campus Connection Requests Monitor
            </h2>
            <div className="space-y-3">
              {connections.map(c => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{c.studentName}</span>
                    <span className="text-gray-400 mx-1.5">→</span>
                    <span className="font-bold text-purple-700">{c.alumniName} ({c.alumniCompany})</span>
                    <div className="text-[10px] text-gray-500 mt-0.5">{c.studentUniversity}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MENTORSHIPS MANAGEMENT */}
        {activeTab === 'mentorships' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft space-y-4 animate-in fade-in">
            <h2 className="font-extrabold text-gray-900 text-base pb-3 border-b border-gray-100">
              Mentorship Sessions Activity
            </h2>
            <div className="space-y-3">
              {mentorships.map(m => (
                <div key={m.id} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{m.studentName} with {m.alumniName}</div>
                    <div className="text-purple-700 font-semibold">{m.goal}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{m.scheduledDate || 'Awaiting schedule'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. ANALYTICS CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart 1: Monthly Growth */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">Network Growth Trajectory</h3>
                    <p className="text-xs text-gray-500">Student & Alumni signups over the last 6 months</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-purple-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Alumni
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-cyan-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Students
                    </span>
                  </div>
                </div>

                <div className="h-60 w-full flex items-end justify-between gap-3 pt-6 px-2">
                  {ADMIN_ANALYTICS.monthlyGrowth.map((data, idx) => {
                    const alumniHeight = (data.alumni / 10000) * 100;
                    const studentHeight = (data.students / 7000) * 100;

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="w-full flex items-end justify-center gap-1.5 h-full">
                          <div
                            style={{ height: `${alumniHeight}%` }}
                            className="w-1/2 bg-purple-600 rounded-t-lg transition-all duration-500 group-hover:bg-purple-500"
                            title={`Alumni: ${data.alumni}`}
                          ></div>
                          <div
                            style={{ height: `${studentHeight}%` }}
                            className="w-1/2 bg-cyan-400 rounded-t-lg transition-all duration-500 group-hover:bg-cyan-300"
                            title={`Students: ${data.students}`}
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-500">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: University Distribution */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-card-soft">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-6">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">Alumni by University</h3>
                    <p className="text-xs text-gray-500">Distribution across premier Indian institutions</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {ADMIN_ANALYTICS.universityDistribution.map((uni, idx) => {
                    const pct = Math.round((uni.count / 5000) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-gray-800">{uni.university}</span>
                          <span className="text-purple-700">{uni.count.toLocaleString()} Users ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Request More Information Note */}
        {requestNoteModalAlumni && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl text-gray-900">
              <h3 className="text-lg font-extrabold">Request Additional Verification Details</h3>
              <p className="text-xs text-gray-500 mt-1">
                Applicant: <strong>{requestNoteModalAlumni.name}</strong> ({requestNoteModalAlumni.company})
              </p>

              <form onSubmit={handleSendMoreInfo} className="mt-4 space-y-3">
                <textarea
                  rows={4}
                  required
                  placeholder="Specify which documents or proofs are missing (e.g. Please upload your company ID card or degree certificate with registration number)..."
                  value={moreInfoNote}
                  onChange={e => setMoreInfoNote(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-300 focus:border-purple-600 outline-none leading-relaxed"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestNoteModalAlumni(null)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
                  >
                    Send Request to Applicant
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
