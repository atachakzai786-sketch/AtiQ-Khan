import { NavigationTab } from '../types';
import { Home, Compass, Library, Sliders } from 'lucide-react';

interface BottomNavProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export function BottomNav({ currentTab, onSelectTab }: BottomNavProps) {
  const tabs = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'explore' as NavigationTab, label: 'Explore', icon: Compass },
    { id: 'library' as NavigationTab, label: 'Library', icon: Library },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Sliders },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="bg-[#0F0F0F]/95 backdrop-blur-xl border-t border-[#1F1F1F] px-4 py-2 flex items-center justify-around select-none z-30"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition duration-150 relative ${
              isActive ? 'text-[#FF6B35]' : 'text-[#8E8E8E] hover:text-[#F5F5F5]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#FF6B35]' : 'scale-100'}`} />
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF6B35] shadow-[0_0_8px_#FF6B35]" />
              )}
            </div>
            <span className="text-[11px] font-medium mt-1.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
