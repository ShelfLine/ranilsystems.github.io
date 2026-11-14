/* ==========================================================================
   Tasks & Kanban Management Module
   HTML5 Drag & Drop, Filtering, and Task CRUD
   ========================================================================== */

const TaskManager = {
  activeFilter: 'all',
  searchQuery: '',
  draggedTaskId: null,

  init() {
    this.bindEvents();
    this.render();

    // Re-render when data updates
    window.dataManager.subscribe((key) => {
      if (key === 'webapp_tasks_data') {
        this.render();
      }
    });
  },

  bindEvents() {
    // Filter by priority
    const priorityFilter = document.getElementById('task-priority-filter');
    if (priorityFilter) {
      priorityFilter.addEventListener('change', (e) => {
        this.activeFilter = e.target.value;
        this.render();
      });
    }

    // Search tasks
    const taskSearch = document.getElementById('task-search-input');
    if (taskSearch) {
      taskSearch.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Add Task Button
    const addTaskBtn = document.getElementById('btn-add-task');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => {
        this.openTaskModal();
      });
    }

    // Task Form Submit
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Kanban Column Drag & Drop Listeners
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(column => {
      column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
      });

      column.addEventListener('dragleave', (e) => {
        if (!column.contains(e.relatedTarget)) {
          column.classList.remove('drag-over');
        }
      });

      column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');
        const status = column.dataset.status;
        if (this.draggedTaskId && status) {
          window.dataManager.updateTask(this.draggedTaskId, { status });
          window.showToast?.(`Task moved to ${this.formatStatus(status)}`, 'info');
          this.draggedTaskId = null;
        }
      });
    });
  },

  formatStatus(status) {
    const map = {
      'backlog': 'Backlog',
      'in-progress': 'In Progress',
      'review': 'In Review',
      'done': 'Done'
    };
    return map[status] || status;
  },

  render() {
    const allTasks = window.dataManager.getTasks();
    const columns = {
      'backlog': document.getElementById('col-backlog'),
      'in-progress': document.getElementById('col-in-progress'),
      'review': document.getElementById('col-review'),
      'done': document.getElementById('col-done')
    };

    // Filter tasks
    const filteredTasks = allTasks.filter(task => {
      const matchesFilter = this.activeFilter === 'all' || task.priority === this.activeFilter;
      const matchesSearch = !this.searchQuery || 
        task.title.toLowerCase().includes(this.searchQuery) || 
        task.desc.toLowerCase().includes(this.searchQuery) ||
        (task.category && task.category.toLowerCase().includes(this.searchQuery));
      return matchesFilter && matchesSearch;
    });

    // Clear column contents
    Object.keys(columns).forEach(status => {
      const col = columns[status];
      if (col) {
        const cardContainer = col.querySelector('.column-cards');
        const countBadge = col.querySelector('.column-count');
        const statusTasks = filteredTasks.filter(t => t.status === status);
        
        if (countBadge) countBadge.textContent = statusTasks.length;
        if (cardContainer) {
          cardContainer.innerHTML = '';
          if (statusTasks.length === 0) {
            cardContainer.innerHTML = `<div style="text-align: center; padding: 24px 12px; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border-color); border-radius: var(--radius-md);">No tasks</div>`;
          } else {
            statusTasks.forEach(task => {
              cardContainer.appendChild(this.createTaskElement(task));
            });
          }
        }
      }
    });

    // Update nav badge count
    const taskNavBadge = document.getElementById('badge-tasks-count');
    if (taskNavBadge) {
      taskNavBadge.textContent = allTasks.filter(t => t.status !== 'done').length;
    }
  },

  createTaskElement(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.id = task.id;

    // Drag events
    card.addEventListener('dragstart', (e) => {
      this.draggedTaskId = task.id;
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.effectAllowed = 'move';
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      this.draggedTaskId = null;
    });

    const priorityClass = `priority-${task.priority || 'medium'}`;

    card.innerHTML = `
      <div class="task-header">
        <span class="task-tag ${priorityClass}">${task.priority}</span>
        <span style="font-size: 0.7rem; color: var(--text-subtle);">${this.escapeHTML(task.category || 'General')}</span>
      </div>
      <h4 class="task-title">${this.escapeHTML(task.title)}</h4>
      ${task.desc ? `<p class="task-desc">${this.escapeHTML(task.desc)}</p>` : ''}
      <div class="task-footer">
        <span>📅 ${task.dueDate || 'No date'}</span>
        <div class="task-actions">
          <button class="action-icon-btn btn-delete" title="Delete Task" data-id="${task.id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Delete button event
    const deleteBtn = card.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete task "${task.title}"?`)) {
        window.dataManager.deleteTask(task.id);
        window.showToast?.('Task deleted', 'info');
      }
    });

    return card;
  },

  openTaskModal() {
    const modal = document.getElementById('task-modal');
    const form = document.getElementById('task-form');
    if (modal && form) {
      form.reset();
      const dueDateInput = document.getElementById('task-due-date');
      if (dueDateInput) {
        dueDateInput.value = new Date().toISOString().split('T')[0];
      }
      modal.classList.add('active');
    }
  },

  closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  handleFormSubmit() {
    const title = document.getElementById('task-title-input').value.trim();
    const desc = document.getElementById('task-desc-input').value.trim();
    const priority = document.getElementById('task-priority-input').value;
    const category = document.getElementById('task-category-input').value.trim();
    const status = document.getElementById('task-status-input').value;
    const dueDate = document.getElementById('task-due-date').value;

    if (!title) {
      alert('Please enter a task title');
      return;
    }

    window.dataManager.addTask({
      title,
      desc,
      priority,
      category: category || 'General',
      status,
      dueDate
    });

    this.closeTaskModal();
    window.showToast?.('New task created!', 'success');
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
};

window.TaskManager = TaskManager;
