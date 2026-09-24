import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { AchievementCategory, AchievementItem } from '../../types';
import { BackButton } from '../common/BackButton';
import {
  Award,
  Search,
  Sparkles,
  Briefcase,
  GraduationCap,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  Share2,
  ThumbsUp,
  X
} from 'lucide-react';

const CATEGORIES: { label: string; value: AchievementCategory | 'all' }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Career Achievement', value: 'Career Achievement' },
  { label: 'Entrepreneurship', value: 'Entrepreneurship' },
  { label: 'Research', value: 'Research' },
  { label: 'Academic Excellence', value: 'Academic Excellence' },
  { label: 'Innovation', value: 'Innovation' },
  { label: 'Social Impact', value: 'Social Impact' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Leadership', value: 'Leadership' }
];

export const AchievementsPage: React.FC = () => {
  const { achievements, selectedAchievement, setSelectedAchievement, addToast, navigate } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'alumni' | 'student'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Filter achievements
  const filteredAchievements = achievements.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (roleFilter !== 'all' && item.personRole !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.personName.toLowerCase().includes(q);
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchInst = item.institution.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      return matchName || matchTitle || matchInst || matchCat || matchDesc;
    }
    return true;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
    addToast(likedMap[id] ? 'Reaction removed' : 'Applauded this achievement!', 'success');
  };

  const handleShare = (item: AchievementItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText?.(window.location.href);
    addToast(`Link to ${item.personName}'s achievement copied!`, 'info');
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <BackButton label="Back to Home" fallbackView="landing" className="mb-3" />
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Alumni & Student Achievements
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Celebrating milestone career breakthroughs, ground-breaking research, startups, and community leadership.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-2xs">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-900 dark:text-white">{achievements.length} Verified</div>
            <div className="text-[10px] text-slate-400">Milestones</div>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400">8 Categories</div>
            <div className="text-[10px] text-slate-400">Ecosystem</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, company, university..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-2xs"
            />
          </div>

          {/* Role Segment Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto text-xs font-bold">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Profiles
            </button>
            <button
              onClick={() => setRoleFilter('alumni')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                roleFilter === 'alumni'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Alumni
            </button>
            <button
              onClick={() => setRoleFilter('student')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                roleFilter === 'student'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Students
            </button>
          </div>
        </div>

        {/* 8 Categories Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.value;
            return (
              <motion.button
                key={cat.value}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-500 shadow-2xs font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Achievements Cards Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No achievements found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or selecting a different category filter above.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setRoleFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAchievements.map(item => {
            const isLiked = !!likedMap[item.id];
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setSelectedAchievement(item)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Year Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60">
                      <Sparkles className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Honor Badge if present */}
                  {item.badge && (
                    <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      <CheckCircle2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      <span>{item.badge}</span>
                    </div>
                  )}
                </div>

                {/* Person Profile Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.avatar}
                      alt={item.personName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <span>{item.personName}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {item.personRole}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate max-w-[160px]">
                        <Building className="w-2.5 h-2.5 shrink-0" />
                        <span>{item.institution}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={e => handleLike(item.id, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isLiked
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Congratulate"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={e => handleShare(item, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Share Achievement"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Achievement Detail Modal with Back Button */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-transparent border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <BackButton
                    label="Back to Achievements"
                    onClick={() => setSelectedAchievement(null)}
                  />
                  <button
                    onClick={() => setSelectedAchievement(null)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-2xs">
                    {selectedAchievement.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Year {selectedAchievement.year}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedAchievement.title}
                </h2>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Recipient Profile Info */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <img
                    src={selectedAchievement.avatar}
                    alt={selectedAchievement.personName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-2xs"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{selectedAchievement.personName}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                        {selectedAchievement.personRole}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedAchievement.institution}
                      {selectedAchievement.companyOrOrg ? ` • ${selectedAchievement.companyOrOrg}` : ''}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedAchievement(null);
                      navigate('explore');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Connect</span>
                    <ExternalLink className="w-3 h-3" />
                  </motion.button>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Achievement Summary & Impact
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                </div>

                {/* Badge Verification */}
                {selectedAchievement.badge && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Institutional Honor / Distinction
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        {selectedAchievement.badge}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedAchievement(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={e => handleShare(selectedAchievement, e)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={e => handleLike(selectedAchievement.id, e)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Applaud Milestone</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
