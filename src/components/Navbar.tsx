import React from 'react';
import { 
  Compass, 
  FlaskConical, 
  BookOpen, 
  Workflow, 
  Sparkles, 
  Cpu,
  Terminal
} from 'lucide-react';

export type ActiveTab = 'overview' | 'labs' | 'catalog' | 'pipeline' | 'wizard' | 'howtorun';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Giải đáp & So sánh', icon: Compass },
    { id: 'labs' as ActiveTab, label: '5 Phòng Lab Tương tác', icon: FlaskConical, badge: 'Hot' },
    { id: 'catalog' as ActiveTab, label: '7 Đề tài Thực chiến', icon: BookOpen },
    { id: 'pipeline' as ActiveTab, label: 'Quy trình ML Chuẩn 6 Bước', icon: Workflow },
    { id: 'wizard' as ActiveTab, label: 'Tạo Kế hoạch Dự án', icon: Sparkles },
    { id: 'howtorun' as ActiveTab, label: 'Cách Chạy Code', icon: Terminal, badge: 'Mới' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>ML PROJECT EXPLORER</span>
                <span className="text-[10px] bg-indigo-950 border border-indigo-700/60 text-indigo-400 font-bold px-1.5 py-0.2 rounded">
                  LAB
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Thế giới Machine Learning ngoài Spam & Chatbot
              </div>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-800/90 text-white shadow-inner border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Nav Scrollable Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
