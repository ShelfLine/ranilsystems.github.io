/* ==========================================================================
   Notes & Scratchpad Module
   Live auto-save, note tagging, pin toggle, and word count
   ========================================================================== */

const NotesManager = {
  activeNoteId: null,
  searchQuery: '',
  saveTimeout: null,

  init() {
    this.bindEvents();
    const notes = window.dataManager.getNotes();
    if (notes.length > 0) {
      this.activeNoteId = notes[0].id;
    }
    this.render();

    // Data changes
    window.dataManager.subscribe((key) => {
      if (key === 'webapp_notes_data') {
        this.renderList();
      }
    });
  },

  bindEvents() {
    // New Note Button
    const newNoteBtn = document.getElementById('btn-new-note');
    if (newNoteBtn) {
      newNoteBtn.addEventListener('click', () => {
        const note = window.dataManager.addNote('New Note', '');
        this.activeNoteId = note.id;
        this.render();
        window.showToast?.('Created new note', 'success');
      });
    }

    // Search Notes
    const notesSearch = document.getElementById('notes-search-input');
    if (notesSearch) {
      notesSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderList();
      });
    }

    // Title Input Auto-Save
    const titleInput = document.getElementById('note-title-field');
    if (titleInput) {
      titleInput.addEventListener('input', (e) => {
        this.triggerAutoSave();
      });
    }

    // Body Textarea Auto-Save & Counter
    const bodyTextarea = document.getElementById('note-body-field');
    if (bodyTextarea) {
      bodyTextarea.addEventListener('input', (e) => {
        this.updateWordCount(e.target.value);
        this.triggerAutoSave();
      });
    }

    // Pin Toggle
    const pinBtn = document.getElementById('btn-pin-note');
    if (pinBtn) {
      pinBtn.addEventListener('click', () => {
        if (!this.activeNoteId) return;
        const notes = window.dataManager.getNotes();
        const active = notes.find(n => n.id === this.activeNoteId);
        if (active) {
          const newPinned = !active.pinned;
          window.dataManager.updateNote(this.activeNoteId, { pinned: newPinned });
          this.render();
          window.showToast?.(newPinned ? 'Note pinned' : 'Note unpinned', 'info');
        }
      });
    }

    // Delete Note
    const deleteBtn = document.getElementById('btn-delete-note');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (!this.activeNoteId) return;
        if (confirm('Are you sure you want to delete this note?')) {
          window.dataManager.deleteNote(this.activeNoteId);
          const remaining = window.dataManager.getNotes();
          this.activeNoteId = remaining.length > 0 ? remaining[0].id : null;
          this.render();
          window.showToast?.('Note deleted', 'info');
        }
      });
    }
  },

  triggerAutoSave() {
    clearTimeout(this.saveTimeout);
    const saveIndicator = document.getElementById('note-save-status');
    if (saveIndicator) saveIndicator.textContent = 'Saving...';

    this.saveTimeout = setTimeout(() => {
      this.saveActiveNote();
      if (saveIndicator) saveIndicator.textContent = 'Saved just now';
    }, 400);
  },

  saveActiveNote() {
    if (!this.activeNoteId) return;
    const titleInput = document.getElementById('note-title-field');
    const bodyTextarea = document.getElementById('note-body-field');

    const title = titleInput ? titleInput.value.trim() || 'Untitled' : 'Untitled';
    const body = bodyTextarea ? bodyTextarea.value : '';

    window.dataManager.updateNote(this.activeNoteId, { title, body });
  },

  updateWordCount(text) {
    const wordCountEl = document.getElementById('note-word-count');
    if (wordCountEl) {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      wordCountEl.textContent = `${words} words · ${chars} characters`;
    }
  },

  render() {
    this.renderList();
    this.renderActiveNote();
  },

  renderList() {
    const listContainer = document.getElementById('notes-list-container');
    if (!listContainer) return;

    const allNotes = window.dataManager.getNotes();

    // Sort: pinned first, then by updatedAt descending
    const sortedNotes = [...allNotes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

    const filtered = sortedNotes.filter(n => {
      if (!this.searchQuery) return true;
      return n.title.toLowerCase().includes(this.searchQuery) ||
             n.body.toLowerCase().includes(this.searchQuery);
    });

    listContainer.innerHTML = '';

    if (filtered.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No notes found</div>`;
      return;
    }

    filtered.forEach(note => {
      const item = document.createElement('div');
      item.className = `note-item ${note.id === this.activeNoteId ? 'active' : ''}`;
      
      const snippet = note.body ? note.body.substring(0, 60).replace(/\n/g, ' ') : 'Empty note';
      const dateStr = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

      item.innerHTML = `
        <div class="note-item-header">
          <span class="note-item-title">${this.escapeHTML(note.title)}</span>
          ${note.pinned ? '<span class="pin-icon" title="Pinned">📌</span>' : ''}
        </div>
        <div class="note-item-snippet">${this.escapeHTML(snippet)}</div>
        <div class="note-item-date">${dateStr}</div>
      `;

      item.addEventListener('click', () => {
        // Save current before switching
        this.saveActiveNote();
        this.activeNoteId = note.id;
        this.render();
      });

      listContainer.appendChild(item);
    });
  },

  renderActiveNote() {
    const titleInput = document.getElementById('note-title-field');
    const bodyTextarea = document.getElementById('note-body-field');
    const pinBtn = document.getElementById('btn-pin-note');
    const dateDisplay = document.getElementById('note-date-display');

    if (!titleInput || !bodyTextarea) return;

    const notes = window.dataManager.getNotes();
    const active = notes.find(n => n.id === this.activeNoteId);

    if (active) {
      titleInput.value = active.title;
      bodyTextarea.value = active.body;
      titleInput.disabled = false;
      bodyTextarea.disabled = false;

      this.updateWordCount(active.body);

      if (pinBtn) {
        pinBtn.style.color = active.pinned ? 'var(--warning)' : 'var(--text-muted)';
      }
      if (dateDisplay) {
        dateDisplay.textContent = `Last modified: ${new Date(active.updatedAt).toLocaleString()}`;
      }
    } else {
      titleInput.value = '';
      bodyTextarea.value = '';
      titleInput.disabled = true;
      bodyTextarea.disabled = true;
      titleInput.placeholder = 'Select or create a note';
      this.updateWordCount('');
    }
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
};

window.NotesManager = NotesManager;
