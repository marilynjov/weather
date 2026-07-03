import type { LucideIcon } from "lucide-react";

import {
  House,
  Building,
  Store,
  Plus,
  PencilLine,
  Calendar,
  FileText,
  Users,
  Sun

} from "lucide-react";


export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient?: string;
  glowColor?: string;
  url: string;
  submenu?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  { 
    id: 'home', 
    label: 'Weather', 
    icon: Sun, 
    gradient: 'from-white/25 to-white/10',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    url: '/'
  },
  { 
    id: 'forecast', 
    label: 'Forecast', 
    icon: Calendar, 
    gradient: 'from-white/25 to-white/10',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    url: '/forecast',
    submenu: [
      {
        id: 'day-forecast',
        label: 'Day',
        icon: Building,
        url: '/forecast/day'
      },
      {
        id: 'week-forecast',
        label: 'Week',
        icon: Store,
        url: '/forecast/week'
      }
    ]
  },
  { 
    id: 'about',
    label: 'About',
    icon: FileText,
    gradient: 'from-white/25 to-white/10',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    url: '/about'
  },
];