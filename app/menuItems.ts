import type { LucideIcon } from "lucide-react";

import {
  House,
  Building,
  Store,
  Plus,
  PencilLine,
  Calendar,
  FileText,
  Users
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
    id: 'start', 
    label: 'Start', 
    icon: House, 
    gradient: 'from-sky-300/60 to-blue-300/60',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    url: 'https://www.polskiewszwecji.com'
  },
  { 
    id: 'firmy', 
    label: 'Polskie firmy', 
    icon: Building, 
    gradient: 'from-blue-500/60 to-blue-600/60',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    url: 'https://www.polskiewszwecji.com/polskie-firmy/',
    submenu: [
      {
        id: 'firmy-lista',
        label: 'Polskie firmy',
        icon: Building,
        url: 'https://www.polskiewszwecji.com/polskie-firmy/'
      },
      {
        id: 'sklepy',
        label: 'Sklepy polonijne',
        icon: Store,
        url: 'https://www.polskiewszwecji.com/polskie-firmy?polski-sklep'
      },
      {
        id: 'dodaj',
        label: '+ dodaj swoją firmę',
        icon: Plus,
        url: 'https://www.polskiewszwecji.com/twoja-firma'
      },
      {
        id: 'edytuj',
        label: '+ edytuj swoją wizytówkę',
        icon: PencilLine,
        url: 'https://www.polskiewszwecji.com/edytuj-firme'
      }
    ]
  },
  { 
    id: 'wydarzenia', 
    label: 'Wydarzenia polonijne', 
    icon: Calendar, 
    gradient: 'from-purple-500/60 to-violet-500/60',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    url: 'https://www.polskiewszwecji.com/wydarzenia'
  },
  { 
    id: 'blog', 
    label: 'Artykuły i blog', 
    icon: FileText, 
    gradient: 'from-green-500/60 to-emerald-500/60',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    url: 'https://www.polskiewszwecji.com/blog'
  },
  { 
    id: 'onas', 
    label: 'O nas', 
    icon: Users, 
    gradient: 'from-red-500/60 to-rose-500/60',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    url: 'https://www.polskiewszwecji.com/o-nas/'
  },
];