import React, { useState, useRef } from 'react';
import {
  X, Check, User, GraduationCap, Briefcase, MapPin, Building2,
  Link, Target, Sparkles, BookOpen, Award, FileText, Upload,
  Camera, Trash2, Image as ImageIcon, Plus, Clock, Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProfileMediaItem } from '../../types';

interface ProfileEditData {
  name: string;
  bio: string;
  university: string;
  course: string;
  graduationYear: string;
  currentCompany: string;
  designation: string;
  industry: string;
  skills: string;
  location: string;
  experience: string;
  interests: string;
  linkedinUrl: string;
  careerGoals: string;
  department: string;
  subjectsCanTeach: string;
  expertise: string;
  learningGoals: string;
  developmentGoals: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  preferredMentorshipAreas: string;
  officeHours: string;
}

interface ProfileEditModalProps {
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ onClose }) => {
  const {
    currentUser,
    studentProfile,
    alumniList,
    teacherProfile,
    teachersList,
    addToast,
    updateUserProfile,
    updateUserAvatar,
    uploadProfileMedia,
    deleteProfileMedia
  } = useApp() as any;

  const role = currentUser.role;
  const isTeacher = role === 'teacher';
  const isAlumni = role === 'alumni';
  const isStudent = role === 'student' || (!isTeacher && !isAlumni);

  const currentAlumni = alumniList.find((a: any) => a.id === currentUser.id) || alumniList[0];
  const activeTeacher = teacherProfile?.id === currentUser.id ? teacherProfile : (teachersList?.find((t: any) => t.id === currentUser.id) || teacherProfile);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'media' | 'skills'>('profile');

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string>(
    currentUser.avatar || (isTeacher ? activeTeacher.avatar : isAlumni ? currentAlumni.avatar : studentProfile.avatar) || ''
  );
  const [avatarChanged, setAvatarChanged] = useState<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Additional Media state
  const existingGallery: ProfileMediaItem[] = isTeacher
    ? (activeTeacher.mediaGallery || [])
    : isAlumni
    ? (currentAlumni.mediaGallery || [])
    : (studentProfile.mediaGallery || []);
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [mediaPendingFile, setMediaPendingFile] = useState<{ url: string; name: string; isAnimated: boolean } | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileEditData>({
    name: isTeacher
      ? activeTeacher.name
      : isAlumni
      ? currentAlumni.name
      : (currentUser.name || studentProfile.name),
    bio: isTeacher
      ? activeTeacher.bio
      : isAlumni
      ? currentAlumni.bio
      : studentProfile.bio,
    university: isTeacher
      ? activeTeacher.university
      : isAlumni
      ? currentAlumni.university
      : (currentUser.university || studentProfile.university),
    course: isAlumni ? currentAlumni.degree : studentProfile.course || '',
    graduationYear: String(isAlumni ? currentAlumni.graduationYear : studentProfile.graduationYear || ''),
    currentCompany: isAlumni ? currentAlumni.company : '',
    designation: isTeacher
      ? activeTeacher.designation
      : isAlumni
      ? currentAlumni.jobTitle
      : '',
    industry: isAlumni ? currentAlumni.industry : '',
    department: isTeacher ? (activeTeacher.department || '') : '',
    officeHours: isTeacher ? (activeTeacher.officeHours || 'Tue, Thu: 2:00 PM - 5:00 PM') : '',
    skills: isTeacher
      ? (activeTeacher.skills || []).join(', ')
      : isAlumni
      ? (currentAlumni.skills || []).join(', ')
      : (studentProfile.skills || []).join(', '),
    subjectsCanTeach: isTeacher ? (activeTeacher.subjectsCanTeach || []).join(', ') : '',
    expertise: isTeacher
      ? (activeTeacher.expertise || []).join(', ')
      : isAlumni
      ? (currentAlumni.expertise || []).join(', ')
      : '',
    learningGoals: isStudent
      ? (studentProfile.learningGoals || []).join(', ')
      : '',
    developmentGoals: isTeacher
      ? (activeTeacher.developmentGoals || '')
      : isAlumni
      ? (currentAlumni.developmentGoals || '')
      : (studentProfile.developmentGoals || ''),
    experienceLevel: studentProfile.experienceLevel || 'Intermediate',
    preferredMentorshipAreas: isTeacher
      ? (activeTeacher.subjectsCanTeach || []).join(', ')
      : isAlumni
      ? (currentAlumni.skills || []).slice(0, 3).join(', ')
      : (studentProfile.preferredMentorshipAreas || []).join(', '),
    location: isTeacher
      ? (activeTeacher.location || 'Roorkee, Uttarakhand')
      : isAlumni
      ? currentAlumni.location
      : studentProfile.location,
    experience: isTeacher
      ? String(activeTeacher.experienceYears || '12')
      : isAlumni
      ? String(currentAlumni.experienceYears || '4')
      : '',
    interests: isStudent ? (studentProfile.interests || []).join(', ') : '',
    linkedinUrl: isTeacher
      ? (activeTeacher.linkedinUrl || '')
      : isAlumni
      ? (currentAlumni.linkedinUrl || '')
      : '',
    careerGoals: isStudent ? (studentProfile.careerGoals || '') : '',
  });

  const handleChange = (field: keyof ProfileEditData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Avatar Upload Handler with GIF preservation
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|webp|gif)/) && !file.name.toLowerCase().endsWith('.gif')) {
      addToast('Please upload a valid image (JPG, PNG, WEBP, or animated GIF).', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('File size exceeds 10MB limit.', 'error');
      return;
    }

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const reader = new FileReader();

    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      if (isGif) {
        // Preserve animated GIF frames directly without canvas compression
        setAvatarPreview(rawDataUrl);
        setAvatarChanged(true);
        addToast('Animated GIF selected! Previewing...', 'info');
      } else {
        // Compress static photos
        const img = new Image();
        img.onload = () => {
          const MAX = 400;
          const scale = Math.min(MAX / img.width, MAX / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
          setAvatarPreview(compressed);
          setAvatarChanged(true);
        };
        img.src = rawDataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  // Gallery Showcase Media Upload
  const handleGalleryMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|webp|gif)/) && !file.name.toLowerCase().endsWith('.gif')) {
      addToast('Please select a valid image or GIF file.', 'error');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      addToast('Media size exceeds 12MB limit.', 'error');
      return;
    }

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    const reader = new FileReader();
    reader.onload = () => {
      setMediaPendingFile({
        url: reader.result as string,
        name: file.name,
        isAnimated: isGif
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmAddMedia = () => {
    if (!mediaPendingFile) return;
    uploadProfileMedia({
      url: mediaPendingFile.url,
      caption: newMediaCaption.trim() || mediaPendingFile.name,
      type: mediaPendingFile.isAnimated ? 'gif' : 'image',
      isAnimated: mediaPendingFile.isAnimated
    });
    setMediaPendingFile(null);
    setNewMediaCaption('');
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    if (avatarChanged && avatarPreview) {
      updateUserAvatar(avatarPreview);
    }
    if (typeof updateUserProfile === 'function') {
      updateUserProfile(form);
    }
    setSaving(false);
    setSaved(true);
    addToast('Profile changes saved successfully.', 'success');
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const Field = ({
    label,
    field,
    type = 'text',
    placeholder,
    icon: Icon,
    multiline,
  }: {
    label: string;
    field: keyof ProfileEditData;
    type?: string;
    placeholder?: string;
    icon?: React.ElementType;
    multiline?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        {label}
      </label>
      {multiline ? (
        <textarea
          value={form[field]}
          onChange={e => handleChange(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={form[field]}
          onChange={e => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
        />
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[190] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full sm:max-w-3xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[92vh] flex flex-col modal-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isTeacher ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
                isAlumni ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' :
                'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
              }`}>
                {role.toUpperCase()} PROFILE
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Edit Personal Profile
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Changes persist across sessions, devices and power the AI matchmaking network
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            General Info
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'media'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Media &amp; Photos
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Skills &amp; Matchmaking
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Photo Quick Section */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-500/20 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-md">
                      {form.name ? form.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  {avatarPreview && avatarPreview.includes('data:image/gif') && (
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-black rounded-md uppercase">
                      GIF
                    </span>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo &amp; Avatar</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports static photos (JPG, PNG) and animated GIFs without distortion.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    <input
                      type="file"
                      ref={avatarInputRef}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleAvatarFile}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Upload Photo / GIF
                    </button>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview('');
                          setAvatarChanged(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Personal Info */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Personal Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" field="name" placeholder="Your full name" icon={User} />
                  <Field label="Location" field="location" placeholder="e.g. Roorkee, Bengaluru" icon={MapPin} />
                </div>
                <div className="mt-4">
                  <Field label="Bio / About Me" field="bio" placeholder="Tell students and peers about your background and interests..." icon={FileText} multiline />
                </div>
              </div>

              {/* Section: Institution / Education */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Academic &amp; Institution
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="College / University" field="university" placeholder="e.g. IIT Roorkee, Tula's Institute" icon={GraduationCap} />
                  {isTeacher ? (
                    <>
                      <Field label="Department" field="department" placeholder="e.g. Computer Science & Engineering" icon={Building2} />
                      <Field label="Academic Designation" field="designation" placeholder="e.g. Professor & Head of AI Lab" icon={Award} />
                      <Field label="Teaching Experience (Years)" field="experience" type="number" placeholder="e.g. 14" icon={Clock} />
                      <Field label="Office Hours" field="officeHours" placeholder="e.g. Mon, Wed: 3:00 PM - 5:00 PM" icon={Clock} />
                    </>
                  ) : isAlumni ? (
                    <>
                      <Field label="Degree Obtained" field="course" placeholder="e.g. B.Tech Computer Science" icon={BookOpen} />
                      <Field label="Graduation Year" field="graduationYear" type="number" placeholder="e.g. 2020" icon={Award} />
                      <Field label="Current Company / Startup" field="currentCompany" placeholder="e.g. Microsoft, Google" icon={Building2} />
                      <Field label="Job Title" field="designation" placeholder="e.g. Staff Engineer" icon={Briefcase} />
                      <Field label="Industry" field="industry" placeholder="e.g. Cloud & AI Infrastructure" icon={Briefcase} />
                      <Field label="Industry Experience (Years)" field="experience" type="number" placeholder="e.g. 6" icon={Award} />
                    </>
                  ) : (
                    <>
                      <Field label="Current Degree / Course" field="course" placeholder="e.g. B.Tech Computer Science" icon={BookOpen} />
                      <Field label="Expected Graduation Year" field="graduationYear" type="number" placeholder="e.g. 2026" icon={Award} />
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <Compass className="w-3.5 h-3.5 text-blue-600" />
                          Experience Level
                        </label>
                        <select
                          value={form.experienceLevel}
                          onChange={e => handleChange('experienceLevel', e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="Beginner">Beginner (1st - 2nd Year / Exploring basics)</option>
                          <option value="Intermediate">Intermediate (3rd Year / Building projects)</option>
                          <option value="Advanced">Advanced (Final Year / Production &amp; Research)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Section: Links */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
                  <Link className="w-3 h-3" /> Online Presence
                </p>
                <Field
                  label="LinkedIn Profile or Portfolio URL"
                  field="linkedinUrl"
                  placeholder="https://linkedin.com/in/username"
                  icon={Link}
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Media Section: Device Upload + Animated GIF Support */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-indigo-950/40 border border-blue-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Profile Media &amp; Showcase Gallery
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Upload project screenshots, certificates, research posters, or animated GIFs to display on your profile.
                    </p>
                  </div>
                </div>

                {/* Upload button & preview */}
                <div className="mt-3">
                  <input
                    type="file"
                    ref={galleryInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleGalleryMediaFile}
                  />

                  {mediaPendingFile ? (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={mediaPendingFile.url}
                          alt="Pending Preview"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {mediaPendingFile.name}
                          </p>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            mediaPendingFile.isAnimated ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {mediaPendingFile.isAnimated ? 'Animated Media (GIF)' : 'Static Image'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                          Media Caption / Title:
                        </label>
                        <input
                          type="text"
                          value={newMediaCaption}
                          onChange={e => setNewMediaCaption(e.target.value)}
                          placeholder="e.g. AI Research Poster Presentation / Hackathon Project"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setMediaPendingFile(null)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmAddMedia}
                          className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Profile Showcase
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full py-6 border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-2 bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all text-indigo-600 dark:text-indigo-400"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-bold">Upload Media File (JPG, PNG, WEBP, GIF)</span>
                      <span className="text-[10px] text-slate-400">Max size: 12MB. Preserves native frame rates for animated GIFs.</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Current Media Showcase Items */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Current Profile Media ({existingGallery.length})
                </h4>
                {existingGallery.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                    No media uploaded yet. Use the upload box above to showcase projects and credentials!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {existingGallery.map(item => (
                      <div
                        key={item.id}
                        className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group shadow-sm"
                      >
                        <img
                          src={item.url}
                          alt={item.caption || 'Profile Media'}
                          className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                        />
                        {item.isAnimated && (
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase">
                            GIF
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteProfileMedia(item.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Delete media"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="p-2.5">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                            {item.caption || 'Showcase Image'}
                          </p>
                          <span className="text-[9px] text-slate-400">{item.uploadedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  AI Matchmaking &amp; Mentorship Alignment
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
                  The AI search engine calculates weighted compatibility scores between students, teachers, and alumni based on these exact tags.
                </p>
              </div>

              {/* Skills Field */}
              <Field
                label="Core & Technical Skills (comma separated)"
                field="skills"
                placeholder="e.g. Python, Machine Learning, Deep Learning, SQL, React"
                icon={Sparkles}
              />

              {isTeacher && (
                <>
                  <Field
                    label="Subjects You Can Teach / Guide (comma separated)"
                    field="subjectsCanTeach"
                    placeholder="e.g. Machine Learning, Python, Data Science, Deep Neural Networks"
                    icon={BookOpen}
                  />
                  <Field
                    label="Research & Technical Expertise (comma separated)"
                    field="expertise"
                    placeholder="e.g. Computer Vision, Applied Statistics, NLP"
                    icon={Award}
                  />
                  <Field
                    label="Teaching / Mentorship Philosophy"
                    field="developmentGoals"
                    placeholder="Describe how you help students build projects and research capabilities..."
                    icon={Target}
                    multiline
                  />
                </>
              )}

              {isStudent && (
                <>
                  <Field
                    label="Current Learning Topics & Goals (comma separated)"
                    field="learningGoals"
                    placeholder="e.g. Machine Learning, Python, Generative AI"
                    icon={Target}
                  />
                  <Field
                    label="Areas of Academic / Career Interest (comma separated)"
                    field="interests"
                    placeholder="e.g. Artificial Intelligence, Data Science, Autonomous Systems"
                    icon={Compass}
                  />
                  <Field
                    label="Preferred Mentorship Areas (comma separated)"
                    field="preferredMentorshipAreas"
                    placeholder="e.g. Machine Learning, Project Guidance, Resume Review"
                    icon={Briefcase}
                  />
                  <Field
                    label="Career & Development Goals"
                    field="careerGoals"
                    placeholder="e.g. Become a Machine Learning Engineer at top product firm..."
                    icon={Target}
                    multiline
                  />
                </>
              )}

              {isAlumni && (
                <>
                  <Field
                    label="Professional Expertise Areas (comma separated)"
                    field="expertise"
                    placeholder="e.g. Distributed Systems, Cloud Architecture, ML in Production"
                    icon={Award}
                  />
                  <Field
                    label="Preferred Mentorship Areas (comma separated)"
                    field="preferredMentorshipAreas"
                    placeholder="e.g. System Design, Career Transitions, Mock Interviews"
                    icon={Briefcase}
                  />
                  <Field
                    label="Professional Development & Mentoring Goals"
                    field="developmentGoals"
                    placeholder="How you plan to give back to juniors and guide their tech growth..."
                    icon={Target}
                    multiline
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pt-4 pb-6 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors btn-press"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex-[2] py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press shadow-sm ${
              saved
                ? 'bg-emerald-600'
                : 'bg-blue-600 hover:bg-blue-700 disabled:opacity-70'
            }`}
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving &amp; Syncing...
              </>
            ) : saved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Saved &amp; Updated!
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
