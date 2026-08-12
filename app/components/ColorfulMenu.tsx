'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {menuItems} from '../menuItems'
import { useI18n } from '../lib/i18n';


export function ColorfulMenu() {
  const { t } = useI18n();
  const [activeItem, setActiveItem] = useState('start');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleItemClick = (item: typeof menuItems[0]) => {
    setActiveItem(item.id);
    if (!item.submenu) {
      window.location.href = item.url;
    }
  };

  const handleSubmenuClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
    <nav className="hidden md:block fixed top-0 left-1/2 -translate-x-1/2 z-50 p-6">
      <div className="flex items-center justify-center">
        {/* Desktop Menu */}
        <div className="backdrop-blur-2xl bg-white/30 rounded-full px-4 py-3 shadow-2xl border border-white/40">
          <div className="relative flex items-center gap-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;
              
              return (
                <div 
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.button
                    onClick={() => handleItemClick(item)}
                    className="relative px-6 py-3 rounded-3xl overflow-hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Glass Background - Active State */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="activeGlass"
                          className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${item.gradient} rounded-3xl border border-white/50`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 35,
                            mass: 0.5
                          }}
                          style={{
                            boxShadow: `0 8px 32px ${item.glowColor}, inset 0 1px 1px rgba(255, 255, 255, 0.5)`,
                          }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Glass Background - Hover State */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 backdrop-blur-md bg-white/20 rounded-3xl border border-white/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0.5 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    
                    {/* Shimmer Effect */}
                    {(isActive || isHovered) && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: '100%', opacity: [0, 0.5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut"
                        }}
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                        }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-2.5 z-10">
                      <motion.div
                        animate={{
                          rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                          scale: isActive ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon className={`size-5 transition-all duration-300 ${
                          isActive ? 'text-white drop-shadow-lg' : 'text-gray-700'
                        }`} />
                      </motion.div>
                      
                      <AnimatePresence mode="wait">
                        {(isActive || isHovered) && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ 
                              type: "spring",
                              stiffness: 500,
                              damping: 30
                            }}
                            className={`overflow-hidden whitespace-nowrap font-medium ${
                              isActive ? 'text-white drop-shadow-md' : 'text-gray-700'
                            }`}
                          >
                            {t(`nav.${item.id}`)}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Chevron for submenu */}
                      {item.submenu && (isActive || isHovered) && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                        >
                          <ChevronDown className={`size-4 transition-all duration-300 ${
                            isActive ? 'text-white' : 'text-gray-700'
                          }`} />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Liquid Ripple Effect on Click */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        initial={{ scale: 0, opacity: 0.6 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        style={{
                          background: `radial-gradient(circle, ${item.glowColor} 0%, transparent 70%)`,
                        }}
                      />
                    )}
                  </motion.button>
                  
                  {/* Submenu Dropdown - Now outside the button */}
                  <AnimatePresence>
                    {item.submenu && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                        className="absolute top-full left-0 mt-2 min-w-[240px] backdrop-blur-2xl bg-white/40 rounded-2xl p-2 shadow-2xl border border-white/40 z-50 gap-2 flex flex-col"
                      >
                        {item.submenu.map((subItem, subIndex) => {
                          const SubIcon = subItem.icon;
                          return (
                            <motion.button
                              key={subItem.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubmenuClick(subItem.url);
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.05 }}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:backdrop-blur-xl hover:bg-gradient-to-r hover:from-white/30 hover:to-white/15 transition-all duration-300 text-left group"
                              whileHover={{ x: 4, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="p-2 rounded-lg bg-white/30 group-hover:bg-white/40 transition-colors">
                                <SubIcon className="size-4 text-gray-700 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors whitespace-nowrap">
                                {t(`nav.${subItem.id}`)}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile hamburger — sits in the column flow */}
    <div className="md:hidden flex justify-center py-3">
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
        className="flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-5 py-2.5 text-gray-800 shadow-2xl backdrop-blur-2xl"
      >
        <Menu className="size-5" />
        <span className="font-medium">Menu</span>
      </button>
    </div>

    {/* Mobile slide-in side drawer */}
    <AnimatePresence>
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-1 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="mb-2 self-end rounded-full p-2 text-gray-700 hover:bg-white/60"
            >
              <X className="size-5" />
            </button>

            {menuItems.map((item) => {
              const Icon = item.icon;
              if (item.submenu) {
                return (
                  <div key={item.id} className="mb-1">
                    <div className="flex items-center gap-3 px-4 py-2 text-gray-800">
                      <Icon className="size-5" />
                      <span className="font-semibold">{t(`nav.${item.id}`)}</span>
                    </div>
                    <div className="ml-4 flex flex-col">
                      {item.submenu.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSubmenuClick(sub.url)}
                            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-gray-700 hover:bg-white/60"
                          >
                            <SubIcon className="size-4" />
                            <span className="text-sm font-medium">{t(`nav.${sub.id}`)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleSubmenuClick(item.url)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-800 hover:bg-white/60"
                >
                  <Icon className="size-5" />
                  <span className="font-medium">{t(`nav.${item.id}`)}</span>
                </button>
              );
            })}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}