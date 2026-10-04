/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { OverviewSection } from './components/OverviewSection';
import { InteractiveLabsContainer } from './components/labs/InteractiveLabsContainer';
import { ProjectCatalog } from './components/ProjectCatalog';
import { MLPipelineGuide } from './components/MLPipelineGuide';
import { ProjectWizard } from './components/ProjectWizard';
import { HowToRunSection } from './components/HowToRunSection';
import { Brain, Heart, Github, Terminal, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewSection
            onNavigateToCatalog={() => setActiveTab('catalog')}
            onNavigateToLabs={() => setActiveTab('labs')}
          />
        )}

        {activeTab === 'labs' && <InteractiveLabsContainer />}

        {activeTab === 'catalog' && <ProjectCatalog />}

        {activeTab === 'pipeline' && <MLPipelineGuide />}

        {activeTab === 'wizard' && <ProjectWizard />}

        {activeTab === 'howtorun' && <HowToRunSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-16 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              ML Project Explorer & Interactive Lab
            </span>
            <span>— Cẩm nang học Machine Learning thực chiến từ cơ bản đến nâng cao.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Dành cho người mới bắt đầu & kỹ sư AI thực hành</span>
            <span>•</span>
            <span>Không chỉ dừng lại ở Spam & Chatbot</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
