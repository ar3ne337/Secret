// =====================================================
// MUSIC TAB SYSTEM - Click app10 to open draggable tab with min/close
// =====================================================

// Global state (accessible to functions)
let musicTab = null;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let tabStartX = 0, tabStartY = 0;
let zIndexCounter = 1000;

// Wait for DOM load
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== Music Tab Script Loaded ===');
  
  // Select elements
  const musicIcon = document.getElementById('app10');  // Music app icon
  const tabContainer = document.getElementById('app-container');  // Parent for tabs
  
  console.log('Music icon found:', musicIcon);
  console.log('Tab container found:', tabContainer);

  // === CLICK HANDLER: Toggle Music Tab ===
  if (musicIcon) {
    musicIcon.style.cursor = 'pointer';  // Ensure clickable
    musicIcon.addEventListener('click', function(e) {
      console.log('MUSIC ICON CLICKED');
      e.stopPropagation();  // Prevent bubble
      
      if (musicTab && musicTab.parentNode) {
        // Close tab if open
        console.log('Closing tab');
        musicTab.remove();
        musicTab = null;
      } else {
        // === CREATE TAB ===
        console.log('Creating Music tab');
        musicTab = createMusicTab(tabContainer);
        
        // Initial position (centered horizontally)
        positionTab();
      }
    });
  } else {
    console.error('ERROR: Music icon (#app10) not found!');
  }
});

// === TAB CREATOR FUNCTION ===
function createMusicTab(container) {
  const tab = document.createElement('div');
  tab.id = 'music-tab';
  tab.className = 'tab';
  tab.style.zIndex = zIndexCounter++;

  console.log('Tab zIndex set to:', tab.style.zIndex);

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

  // Content (empty as requested)
  const content = document.createElement('div');
  content.className = 'tab-content';
  // Empty - no text

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
  musicTab.style.width = '400px';
  musicTab.style.height = '300px';
  musicTab.style.transform = 'translateX(-50%)';
}

// === DRAG FUNCTIONS ===
function startDrag(e) {
  if (e.target.classList.contains('tab-btn')) return;  // Don't drag on buttons
  
  console.log('Drag started');
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  const rect = musicTab.getBoundingClientRect();
  tabStartX = rect.left;
  tabStartY = rect.top;
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  musicTab.style.left = (tabStartX + dx) + 'px';
  musicTab.style.top = (tabStartY + dy) + 'px';
  musicTab.style.transform = 'none';
}

function stopDrag() {
  console.log('Drag stopped');
  isDragging = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}

// === MINIMIZE / CLOSE ===
function toggleMinimize() {
  console.log('Minimize toggled');
  musicTab.classList.toggle('minimized');
}

function closeTab() {
  console.log('Tab closed');
  musicTab.remove();
  musicTab = null;
}

// =====================================================
// END MUSIC TAB SYSTEM
// =====================================================

