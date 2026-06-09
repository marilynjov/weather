'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import {menuItems} from '../menuItems'


export function ColorfulMenu() {
  const [activeItem, setActiveItem] = useState('start');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (item: typeof menuItems[0]) => {
    setActiveItem(item.id);
    if (!item.submenu) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmenuClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="p-6">
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
                        animate={{ opacity: isHovered ? 1 : 0 }}
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
                            {item.label}
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
                        className="absolute top-full left-0 mt-2 min-w-[240px] backdrop-blur-2xl bg-white/40 rounded-2xl p-2 shadow-2xl border border-white/40 z-50"
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
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:backdrop-blur-xl hover:bg-gradient-to-r hover:from-blue-500/60 hover:to-blue-600/60 transition-all duration-300 text-left group"
                              whileHover={{ x: 4, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="p-2 rounded-lg bg-white/30 group-hover:bg-white/40 transition-colors">
                                <SubIcon className="size-4 text-gray-700 group-hover:text-white transition-colors" />
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors whitespace-nowrap">
                                {subItem.label}
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
  );
}