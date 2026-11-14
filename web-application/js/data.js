/* ==========================================================================
   Data & State Management Module
   Local storage persistence, initial seed data, and reactive dispatch
   ========================================================================== */

const STORAGE_KEYS = {
  TASKS: 'webapp_tasks_data',
  NOTES: 'webapp_notes_data',
  USER: 'webapp_user_data',
  SETTINGS: 'webapp_settings_data',
  ACTIVITIES: 'webapp_activities_data'
};

const DEFAULT_TASKS = [
  {
    id: 't-101',
    title: 'Initialize web application repository',
    desc: 'Set up folder structure, vanilla design tokens, HTML semantic layout, and local server.',
    status: 'done',
    priority: 'high',
    category: 'Engineering',
    dueDate: '2026-11-14'
  },
  {
    id: 't-102',
    title: 'Design interactive dashboard cards',
    desc: 'Implement SVG metric charts, KPI counters, and live activity streams.',
    status: 'done',
    priority: 'medium',
    category: 'Design',
    dueDate: '2026-11-15'
  },
  {
    id: 't-103',
    title: 'Implement Kanban Drag & Drop',
    desc: 'Add HTML5 drag and drop handlers to move tasks between stages seamlessly.',
    status: 'in-progress',
    priority: 'high',
    category: 'Feature',
    dueDate: '2026-11-16'
  },
  {
    id: 't-104',
    title: 'Add Quick Notes with auto-saving',
    desc: 'Build markdown/scratchpad editor with pin functionality and instant persistence.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Feature',
    dueDate: '2026-11-17'
  },
  {
    id: 't-105',
    title: 'Command Palette (Ctrl + K)',
    desc: 'Global search and keyboard shortcuts modal for lightning-fast navigation.',
    status: 'review',
    priority: 'low',
    category: 'UX',
    dueDate: '2026-11-18'
  },
  {
    id: 't-106',
    title: 'Setup automated end-to-end tests',
    desc: 'Verify cross-browser rendering, theme toggle, and local storage serialization.',
    status: 'backlog',
    priority: 'medium',
    category: 'QA',
    dueDate: '2026-11-20'
  }
];

const DEFAULT_NOTES = [
  {
    id: 'n-1',
    title: 'Product Roadmap & Architecture',
    body: 'Key Architectural Principles:\n1. Zero external dependencies - pure vanilla web standards.\n2. Instant load times (<50ms) with lightweight CSS custom properties.\n3. Offline-first resilience with structured localStorage.\n4. Accessible, semantic HTML5 elements throughout.',
    tags: ['Architecture', 'Planning'],
    pinned: true,
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'n-2',
    title: 'Design System & Color Tokens',
    body: 'Themes are powered by CSS custom properties:\n- Light Mode: Crisp white background, slate borders, deep charcoal text.\n- Dark Mode: Slate/navy background with high contrast.\n- Accent colors: Indigo (Default), Emerald, Violet, Rose, Amber.',
    tags: ['Design', 'UI'],
    pinned: false,
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'n-3',
    title: 'Meeting Notes: Sprint Kickoff',
    body: 'Discussed project scope, deliverables, and user feedback integration. Everyone is aligned on keeping the footprint minimal while delivering high-fidelity interactive widgets.',
    tags: ['Meetings'],
    pinned: false,
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const DEFAULT_USER = {
  name: 'Alex Mercer',
  role: 'Lead Architect',
  email: 'alex.mercer@example.com',
  avatar: 'AM'
};

const DEFAULT_SETTINGS = {
  theme: 'light',
  accent: 'indigo',
  notifications: true,
  autoSave: true
};

const DEFAULT_ACTIVITIES = [
  { id: 'a-1', desc: 'Project "Web Application" initialized successfully', time: 'Just now' },
  { id: 'a-2', desc: 'Moved "Design interactive dashboard cards" to Done', time: '12m ago' },
  { id: 'a-3', desc: 'Created note "Product Roadmap & Architecture"', time: '1h ago' },
  { id: 'a-4', desc: 'Updated accent color theme to Indigo', time: '3h ago' }
];

class DataManager {
  constructor() {
    this.listeners = [];
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      this.save(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
      this.save(STORAGE_KEYS.NOTES, DEFAULT_NOTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      this.save(STORAGE_KEYS.USER, DEFAULT_USER);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      this.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      this.save(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
    }
  }

  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return null;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      this.notify(key, val);
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify(key, data) {
    this.listeners.forEach(cb => {
      try {
        cb(key, data);
      } catch (err) {
        console.error('Data subscriber error:', err);
      }
    });
  }

  // Task helpers
  getTasks() {
    return this.get(STORAGE_KEYS.TASKS) || [];
  }

  saveTasks(tasks) {
    this.save(STORAGE_KEYS.TASKS, tasks);
  }

  addTask(task) {
    const tasks = this.getTasks();
    const newTask = {
      id: 't-' + Date.now().toString(36),
      title: task.title,
      desc: task.desc || '',
      status: task.status || 'backlog',
      priority: task.priority || 'medium',
      category: task.category || 'General',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0]
    };
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    this.logActivity(`Created task "${newTask.title}"`);
    return newTask;
  }

  updateTask(id, updates) {
    const tasks = this.getTasks();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      tasks[idx] = { ...tasks[idx], ...updates };
      this.saveTasks(tasks);
      return tasks[idx];
    }
    return null;
  }

  deleteTask(id) {
    const tasks = this.getTasks();
    const taskToDelete = tasks.find(t => t.id === id);
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
    if (taskToDelete) {
      this.logActivity(`Deleted task "${taskToDelete.title}"`);
    }
  }

  // Note helpers
  getNotes() {
    return this.get(STORAGE_KEYS.NOTES) || [];
  }

  saveNotes(notes) {
    this.save(STORAGE_KEYS.NOTES, notes);
  }

  addNote(title = 'Untitled Note', body = '') {
    const notes = this.getNotes();
    const newNote = {
      id: 'n-' + Date.now().toString(36),
      title: title,
      body: body,
      tags: ['Draft'],
      pinned: false,
      updatedAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    this.saveNotes(notes);
    this.logActivity(`Created note "${title}"`);
    return newNote;
  }

  updateNote(id, updates) {
    const notes = this.getNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx !== -1) {
      notes[idx] = { ...notes[idx], ...updates, updatedAt: new Date().toISOString() };
      this.saveNotes(notes);
      return notes[idx];
    }
    return null;
  }

  deleteNote(id) {
    const notes = this.getNotes();
    const filtered = notes.filter(n => n.id !== id);
    this.saveNotes(filtered);
  }

  // Activity log
  getActivities() {
    return this.get(STORAGE_KEYS.ACTIVITIES) || [];
  }

  logActivity(desc) {
    const activities = this.getActivities();
    activities.unshift({
      id: 'a-' + Date.now().toString(36),
      desc: desc,
      time: 'Just now'
    });
    if (activities.length > 15) activities.pop();
    this.save(STORAGE_KEYS.ACTIVITIES, activities);
  }

  // Settings & User
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || DEFAULT_SETTINGS;
  }

  saveSettings(settings) {
    this.save(STORAGE_KEYS.SETTINGS, settings);
  }

  getUser() {
    return this.get(STORAGE_KEYS.USER) || DEFAULT_USER;
  }

  saveUser(user) {
    this.save(STORAGE_KEYS.USER, user);
  }

  // Reset demo data
  resetAll() {
    this.save(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    this.save(STORAGE_KEYS.NOTES, DEFAULT_NOTES);
    this.save(STORAGE_KEYS.USER, DEFAULT_USER);
    this.save(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.save(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES);
  }
}

// Global data manager instance
window.dataManager = new DataManager();
