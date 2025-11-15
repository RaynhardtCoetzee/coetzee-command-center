'use client';

import { create } from 'zustand';

type ViewType = 'list' | 'kanban';

interface ViewPreferenceState {
  taskView: ViewType;
  setTaskView: (view: ViewType) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const getInitialView = (): ViewType => {
  if (typeof window === 'undefined') return 'list';
  const saved = localStorage.getItem('task-view-preference');
  return saved === 'list' || saved === 'kanban' ? saved : 'list';
};

export const useViewPreference = create<ViewPreferenceState>((set) => ({
  taskView: getInitialView(),
  _hasHydrated: false,
  setHasHydrated: (state) => {
    set({ _hasHydrated: state });
  },
  setTaskView: (view) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('task-view-preference', view);
    }
    set({ taskView: view });
  },
}));

// Hydrate from localStorage on client mount
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('task-view-preference');
  if (saved === 'list' || saved === 'kanban') {
    useViewPreference.setState({ taskView: saved, _hasHydrated: true });
  } else {
    useViewPreference.setState({ _hasHydrated: true });
  }
}

