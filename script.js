// =====================================================
// MUSIC TAB SYSTEM - Click app10 to open draggable tab with min/close
// =====================================================

// Global state (accessible to functions)
let musicTab = null;
let notepadTab = null;
let pdfTab = null;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let tabStartX = 0, tabStartY = 0;
let zIndexCounter = 1000;

// Wait for DOM load
document.addEventListener('DOMContentLoaded', function() {
  // console.log('=== Music Tab Script Loaded ===');
  
  // Select elements
  const musicIcon = document.getElementById('app10');  // Music app icon
  const tabContainer = document.getElementById('app-container');  // Parent for tabs
  
  // console.log('Music icon found:', musicIcon);
  // console.log('Tab container found:', tabContainer);

  // === CLICK HANDLER: Toggle Music Tab ===
  if (musicIcon) {
    musicIcon.style.cursor = 'pointer';  // Ensure clickable
    musicIcon.addEventListener('click', function(e) {
      // console.log('MUSIC ICON CLICKED');
      e.stopPropagation();  // Prevent bubble
      
      if (musicTab && musicTab.parentNode) {
        // Close tab if open
        // console.log('Closing tab');
        musicTab.remove();
        musicTab = null;
      } else {
        // === CREATE TAB ===
        // console.log('Creating Music tab');
        musicTab = createMusicTab(tabContainer);
        
        // Initial position (centered horizontally)
        positionTab();
      }
    });
  } else {
    // console.error('ERROR: Music icon (#app10) not found!');
  }

  // === NOTEPAD CLICK HANDLER ===
  const notepadIcon = document.getElementById('app6');
  if (notepadIcon) {
    notepadIcon.style.cursor = 'pointer';
    notepadIcon.addEventListener('click', function(e) {
      // console.log('NOTEPAD ICON CLICKED');
      e.stopPropagation();
      
      if (notepadTab && notepadTab.parentNode) {
        notepadTab.remove();
        notepadTab = null;
      } else {
        notepadTab = createNotepadTab(tabContainer);
        positionNotepadTab();
      }
    });
  }

  // === PDF CLICK HANDLER ===
  const pdfIcon = document.getElementById('app7');
  if (pdfIcon) {
    pdfIcon.style.cursor = 'pointer';
    pdfIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (pdfTab && pdfTab.parentNode) {
        pdfTab.remove();
        pdfTab = null;
      } else {
        pdfTab = createPdfTab(tabContainer);
        positionPdfTab();
      }
    });
  }
});

// === TAB CREATOR FUNCTION ===
function createMusicTab(container) {
  const tab = document.createElement('div');
  tab.id = 'music-tab';
  tab.className = 'tab';
  tab.style.zIndex = zIndexCounter++;

  // console.log('Tab zIndex set to:', tab.style.zIndex);

  // Header (draggable area)
  const header = document.createElement('div');
  header.className = 'tab-header';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = 'Music';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'tab-controls';

  // Minimize button
  const minBtn = document.createElement('div');
  minBtn.className = 'tab-btn minimize';
  minBtn.textContent = '-';
  minBtn.title = 'Minimize (click to toggle)';

  // Close button
  const closeBtn = document.createElement('div');
  closeBtn.className = 'tab-btn close';
  closeBtn.textContent = '×';
  closeBtn.title = 'Close tab';

  controls.appendChild(minBtn);
  controls.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(controls);

  // Load Music player via iframe (isolated, correct relative paths)
  const content = document.createElement('div');
  content.className = 'tab-content';
  content.style.padding = '0';
  
  const iframe = document.createElement('iframe');
  iframe.src = 'Applications/Music/Music.html';
  iframe.style.width = '100%';
  iframe.style.height = 'calc(100% - 32px)';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';
  iframe.allow = 'autoplay';
  
  content.appendChild(iframe);

  tab.appendChild(header);
  tab.appendChild(content);
  container.appendChild(tab);


  // === DRAG LOGIC ===
  header.addEventListener('mousedown', startDrag);

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize();
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab();
  });

  // Bring to front on mousedown
  tab.addEventListener('mousedown', function() {
    tab.style.zIndex = zIndexCounter++;
  });

  // Prevent text selection during drag
  header.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  return tab;
}

function createNotepadTab(container) {
  const tab = document.createElement('div');
  tab.id = 'notepad-tab';
  tab.className = 'tab';
  tab.style.zIndex = zIndexCounter++;

  // console.log('Notepad Tab zIndex set to:', tab.style.zIndex);

  // Header (draggable area)
  const header = document.createElement('div');
  header.className = 'tab-header';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = 'Notepad';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'tab-controls';

  // Minimize button
  const minBtn = document.createElement('div');
  minBtn.className = 'tab-btn minimize';
  minBtn.textContent = '-';
  minBtn.title = 'Minimize (click to toggle)';

  // Close button
  const closeBtn = document.createElement('div');
  closeBtn.className = 'tab-btn close';
  closeBtn.textContent = '×';
  closeBtn.title = 'Close tab';

  controls.appendChild(minBtn);
  controls.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(controls);

  // Load Notepad via iframe
  const content = document.createElement('div');
  content.className = 'tab-content';
  content.style.padding = '0';
  
  const iframe = document.createElement('iframe');
  iframe.src = 'Applications/Notepad/Notepad.html';
  iframe.style.width = '100%';
  iframe.style.height = 'calc(100% - 32px)';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';
  
  content.appendChild(iframe);

  tab.appendChild(header);
  tab.appendChild(content);
  container.appendChild(tab);

  // === DRAG LOGIC ===
  header.addEventListener('mousedown', startDrag);

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize();
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab();
  });

  // Bring to front on mousedown
  tab.addEventListener('mousedown', function() {
    tab.style.zIndex = zIndexCounter++;
  });

  // Prevent text selection during drag
  header.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  return tab;
}

function createPdfTab(container) {
  const tab = document.createElement('div');
  tab.id = 'pdf-tab';
  tab.className = 'tab';
  tab.style.zIndex = zIndexCounter++;

  // Header (draggable area)
  const header = document.createElement('div');
  header.className = 'tab-header';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = 'PDF';

  // Controls
  const controls = document.createElement('div');
  controls.className = 'tab-controls';

  // Minimize button
  const minBtn = document.createElement('div');
  minBtn.className = 'tab-btn minimize';
  minBtn.textContent = '-';
  minBtn.title = 'Minimize (click to toggle)';

  // Close button
  const closeBtn = document.createElement('div');
  closeBtn.className = 'tab-btn close';
  closeBtn.textContent = '×';
  closeBtn.title = 'Close tab';

  controls.appendChild(minBtn);
  controls.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(controls);

  // Load PDF via iframe
  const content = document.createElement('div');
  content.className = 'tab-content';
  content.style.padding = '0';
  
  const iframe = document.createElement('iframe');
  iframe.src = 'Applications/PDF/PDF.html';
  iframe.style.width = '100%';
  iframe.style.height = 'calc(100% - 32px)';
  iframe.style.border = 'none';
  iframe.style.background = 'transparent';

  
  content.appendChild(iframe);

  tab.appendChild(header);
  tab.appendChild(content);
  container.appendChild(tab);

  // === DRAG LOGIC ===
  header.addEventListener('mousedown', startDrag);

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize();
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab();
  });

  // Bring to front on mousedown
  tab.addEventListener('mousedown', function() {
    tab.style.zIndex = zIndexCounter++;
  });

  // Prevent text selection during drag
  header.addEventListener('selectstart', function(e) {
    e.preventDefault();
  });

  return tab;
}

// === UTILITY FUNCTIONS ===
function positionTab() {
  musicTab.style.left = '50%';
  musicTab.style.top = '20vh';
  musicTab.style.width = '450px';
  musicTab.style.height = '550px';
  musicTab.style.transform = 'translateX(-50%)';
}

function positionNotepadTab() {
  notepadTab.style.left = '50%';
  notepadTab.style.top = '20vh';
  notepadTab.style.width = '600px';
  notepadTab.style.height = '500px';
  notepadTab.style.transform = 'translateX(-50%)';
}

function positionPdfTab() {
  pdfTab.style.left = '50%';
  pdfTab.style.top = '20vh';
  pdfTab.style.width = '700px';
  pdfTab.style.height = '600px';
  pdfTab.style.transform = 'translateX(-50%)';
}


// === DRAG FUNCTIONS ===
function startDrag(e) {
  if (e.target.classList.contains('tab-btn')) return;  // Don't drag on buttons
  
  // console.log('Drag started');
  const currentTab = musicTab || notepadTab || pdfTab;
  if (!currentTab) return;
  
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  const rect = currentTab.getBoundingClientRect();
  tabStartX = rect.left;
  tabStartY = rect.top;
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  const currentTab = musicTab || notepadTab || pdfTab;
  currentTab.style.left = (tabStartX + dx) + 'px';
  currentTab.style.top = (tabStartY + dy) + 'px';
  currentTab.style.transform = 'none';
}

function stopDrag() {
  // console.log('Drag stopped');
  isDragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}

// === MINIMIZE / CLOSE ===
function toggleMinimize() {
  // console.log('Minimize toggled');
  const currentTab = musicTab || notepadTab || pdfTab;
  if (currentTab) currentTab.classList.toggle('minimized');
}

function closeTab() {
  // console.log('Tab closed');
  const currentTab = musicTab || notepadTab || pdfTab;
  if (currentTab) {
    currentTab.remove();
    if (currentTab === musicTab) musicTab = null;
    else if (currentTab === notepadTab) notepadTab = null;
    else pdfTab = null;
  }
}

// =====================================================
// END MUSIC TAB SYSTEM
// =====================================================

// =====================================================
// CLOCK SYSTEM - Live device time in taskbar
// =====================================================

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const clockEl = document.getElementById('clock');
  if (clockEl) {
    clockEl.textContent = `${hours}:${minutes}`;
  }
}

// Clock initialization (runs on DOM load)
document.addEventListener('DOMContentLoaded', function() {
  updateClock();  // Initial update
  setInterval(updateClock, 1000);  // Update every second
});

