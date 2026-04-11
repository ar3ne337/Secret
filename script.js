// =====================================================
// MUSIC TAB SYSTEM - Click app10 to open draggable tab with min/close
// =====================================================

// Global state (accessible to functions)
let musicTab = null;
let notepadTab = null;
let pdfTab = null;
let fileExplorerTab = null;
let folderExplorerTab = null;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let tabStartX = 0, tabStartY = 0;
let zIndexCounter = 1000;
let currentDragTab = null;

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

  // === THIS PC (FILE EXPLORER WITH DISKS) CLICK HANDLER ===
  const thisPCIcon = document.getElementById('app1');
  if (thisPCIcon) {
    thisPCIcon.style.cursor = 'pointer';
    thisPCIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (fileExplorerTab && fileExplorerTab.parentNode) {
        fileExplorerTab.remove();
        fileExplorerTab = null;
      } else {
        fileExplorerTab = createDiskExplorerTab(tabContainer);
        positionFileExplorerTab();
      }
    });
  }

  // === FOLDER ICON (FILE EXPLORER WITH 5 FOLDERS) CLICK HANDLER ===
  const folderIcon = document.getElementById('app4');
  if (folderIcon) {
    folderIcon.style.cursor = 'pointer';
    folderIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      
      if (folderExplorerTab && folderExplorerTab.parentNode) {
        folderExplorerTab.remove();
        folderExplorerTab = null;
      } else {
        folderExplorerTab = createFolderExplorerTab(tabContainer);
        positionFolderExplorerTab();
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
  header.addEventListener('mousedown', function(e) {
    startDrag(e, tab);
  });

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize(tab);
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab(tab);
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
  header.addEventListener('mousedown', function(e) {
    startDrag(e, tab);
  });

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize(tab);
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab(tab);
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
  header.addEventListener('mousedown', function(e) {
    startDrag(e, tab);
  });

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize(tab);
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab(tab);
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

// === DISK EXPLORER TAB (This PC) ===
function createDiskExplorerTab(container) {
  const tab = document.createElement('div');
  tab.id = 'file-explorer-tab';
  tab.className = 'tab';
  tab.style.zIndex = zIndexCounter++;

  // Header (draggable area)
  const header = document.createElement('div');
  header.className = 'tab-header';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = 'This PC';

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

  // Create File Explorer content
  const content = document.createElement('div');
  content.className = 'tab-content';
  content.style.padding = '0';
  
  // Create File Explorer UI
  const explorer = document.createElement('div');
  explorer.className = 'file-explorer';
  
  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'explorer-toolbar';
  toolbar.innerHTML = `
    <div class="nav-buttons">
      <button class="nav-btn" title="Back" id="back-btn">←</button>
      <button class="nav-btn" title="Forward">→</button>
      <button class="nav-btn" title="Up" id="up-btn">↑</button>
    </div>
    <div class="address-bar">
      <div class="address-icon"></div>
      <span class="address-text" id="address-text">This PC</span>
    </div>
    <div class="search-box">
      <span class="search-icon"></span>
      <input type="text" placeholder="Search This PC">
    </div>
  `;
  
  // Main area with sidebar and content
  const main = document.createElement('div');
  main.className = 'explorer-main';
  
  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'explorer-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-section">
      <div class="sidebar-header">Quick access</div>
      <div class="sidebar-item active" data-nav="thispc">
        <div class="sidebar-icon pc"></div>
        <span>This PC</span>
      </div>
      <div class="sidebar-item" data-nav="documents">
        <div class="sidebar-icon folder"></div>
        <span>Documents</span>
      </div>
      <div class="sidebar-item" data-nav="downloads">
        <div class="sidebar-icon downloads"></div>
        <span>Downloads</span>
      </div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-header">This PC</div>
      <div class="sidebar-item" data-nav="desktop">
        <div class="sidebar-icon folder"></div>
        <span>Desktop</span>
      </div>
      <div class="sidebar-item" data-nav="documents">
        <div class="sidebar-icon documents"></div>
        <span>Documents</span>
      </div>
      <div class="sidebar-item" data-nav="pictures">
        <div class="sidebar-icon pictures"></div>
        <span>Pictures</span>
      </div>
      <div class="sidebar-item" data-nav="music">
        <div class="sidebar-icon music"></div>
        <span>Music</span>
      </div>
      <div class="sidebar-item" data-nav="videos">
        <div class="sidebar-icon videos"></div>
        <span>Videos</span>
      </div>
    </div>
  `;
  
  // Content area
  const contentArea = document.createElement('div');
  contentArea.className = 'explorer-content';
  contentArea.id = 'explorer-content-area';
  
  // Create Devices and drives section
  const devicesSection = document.createElement('div');
  devicesSection.className = 'content-section';
  devicesSection.innerHTML = `
    <div class="section-header">
      <div class="section-header-icon devices"></div>
      <span>Devices and drives</span>
    </div>
  `;
  
  // Create disks grid
  const disksGrid = document.createElement('div');
  disksGrid.className = 'folder-grid';
  disksGrid.id = 'disks-grid';
  
  // Disk data
  const disks = [
    { name: 'Local Disk (C:)', total: '1 PB', used: '333 TB', free: '667 TB', usedPercent: 33, type: 'Local Disk' },
    { name: 'Local Disk (E:)', total: '2 TB', used: '1.2 TB', free: '800 GB', usedPercent: 60, type: 'Local Disk' },
    { name: 'Local Disk (F:)', total: '500 GB', used: '375 GB', free: '125 GB', usedPercent: 75, type: 'Local Disk' },
    { name: 'USB Drive (G:)', total: '500 GB', used: '335 GB', free: '165 GB', usedPercent: 67, type: 'USB Drive' },
    { name: 'SSD (H:)', total: '1 TB', used: '250 GB', free: '750 GB', usedPercent: 25, type: 'SSD' },
    { name: 'NVMe (I:)', total: '2 TB', used: '500 GB', free: '1.5 TB', usedPercent: 25, type: 'NVMe SSD' }
  ];
  
  disks.forEach(disk => {
    const diskItem = document.createElement('div');
    diskItem.className = 'disk-item';
    
    const barClass = disk.usedPercent > 80 ? 'critical' : (disk.usedPercent > 60 ? 'warning' : '');
    
    diskItem.innerHTML = `
      <div class="disk-icon ${disk.type === 'USB Drive' ? 'usb-icon' : ''}"></div>
      <div class="disk-name">
        <div class="storage-info">
          <span>${disk.name}</span>
          <div class="storage-details">
            <span>${disk.used} used</span>
            <span>${disk.free} free</span>
          </div>
          <div class="storage-bar">
            <div class="storage-bar-fill ${barClass}" style="width: ${disk.usedPercent}%"></div>
          </div>
        </div>
      </div>
      <div class="disk-space">${disk.total}</div>
      <div class="disk-type">${disk.type}</div>
    `;
    
    disksGrid.appendChild(diskItem);
  });
  
  devicesSection.appendChild(disksGrid);
  
  // Create Network locations section
  const networkSection = document.createElement('div');
  networkSection.className = 'content-section';
  networkSection.style.marginTop = '24px';
  networkSection.innerHTML = `
    <div class="section-header">
      <div class="section-header-icon network-header"></div>
      <span>Network locations</span>
    </div>
  `;
  
  // Create network grid
  const networkGrid = document.createElement('div');
  networkGrid.className = 'folder-grid';
  networkGrid.id = 'network-grid';
  
  // Network data
  const networks = [
    { name: 'nymos.web', total: '100 PB', used: '10 PB', free: '90 PB', usedPercent: 10, type: 'Network Drive' }
  ];
  
  networks.forEach(network => {
    const networkItem = document.createElement('div');
    networkItem.className = 'network-item';
    
    const barClass = network.usedPercent > 80 ? 'critical' : (network.usedPercent > 60 ? 'warning' : '');
    
    networkItem.innerHTML = `
      <div class="network-icon"></div>
      <div class="network-name">
        <div class="storage-info">
          <span>${network.name}</span>
          <div class="storage-details">
            <span>${network.used} used</span>
            <span>${network.free} free</span>
          </div>
          <div class="storage-bar">
            <div class="storage-bar-fill ${barClass}" style="width: ${network.usedPercent}%"></div>
          </div>
        </div>
      </div>
      <div class="network-space">${network.total}</div>
      <div class="network-type">${network.type}</div>
    `;
    
    networkGrid.appendChild(networkItem);
  });
  
  networkSection.appendChild(networkGrid);
  
  contentArea.appendChild(devicesSection);
  contentArea.appendChild(networkSection);
  
  main.appendChild(sidebar);
  main.appendChild(contentArea);
  
  // Status bar
  const statusbar = document.createElement('div');
  statusbar.className = 'explorer-statusbar';
  statusbar.innerHTML = `
    <div class="status-left">
      <span>${disks.length + networks.length} items</span>
    </div>
    <div class="status-right">
      <div class="view-options">
        <button class="view-btn" title="Details"><img src="Sources/DesktopIcons/View.png" alt="Details" style="width:14px;height:14px;vertical-align:middle;filter:invert(1);"></button>
        <button class="view-btn" title="Icons"><img src="Sources/DesktopIcons/Icons.png" alt="Icons" style="width:14px;height:14px;vertical-align:middle;filter:invert(1);"></button>
        <button class="view-btn" title="List"><img src="Sources/DesktopIcons/List.png" alt="List" style="width:14px;height:14px;vertical-align:middle;filter:invert(1);"></button>
      </div>
    </div>
  `;
  
  explorer.appendChild(toolbar);
  explorer.appendChild(main);
  explorer.appendChild(statusbar);
  
  content.appendChild(explorer);
  tab.appendChild(header);
  tab.appendChild(content);
  container.appendChild(tab);

  // === DRAG LOGIC ===
  header.addEventListener('mousedown', function(e) {
    startDrag(e, tab);
  });

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize(tab);
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab(tab);
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

// === FOLDER EXPLORER TAB (Folder app) ===
function createFolderExplorerTab(container) {
  const tab = document.createElement('div');
  tab.id = 'folder-explorer-tab';
  tab.className = 'tab';
  tab.style.zIndex = zIndexCounter++;

  // Header (draggable area)
  const header = document.createElement('div');
  header.className = 'tab-header';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = 'Documents';

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

  // Create File Explorer content
  const content = document.createElement('div');
  content.className = 'tab-content';
  content.style.padding = '0';
  
  // Create File Explorer UI
  const explorer = document.createElement('div');
  explorer.className = 'file-explorer';
  
  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'explorer-toolbar';
  toolbar.innerHTML = `
    <div class="nav-buttons">
      <button class="nav-btn" title="Back" id="folder-back-btn">←</button>
      <button class="nav-btn" title="Forward">→</button>
      <button class="nav-btn" title="Up" id="folder-up-btn">↑</button>
    </div>
    <div class="address-bar">
      <div class="address-icon"></div>
      <span class="address-text" id="folder-address-text">This PC > Documents</span>
    </div>
    <div class="search-box">
      <span class="search-icon"></span>
      <input type="text" placeholder="Search Documents">
    </div>
  `;
  
  // Main area with sidebar and content
  const main = document.createElement('div');
  main.className = 'explorer-main';
  
  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'explorer-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-section">
      <div class="sidebar-header">Quick access</div>
      <div class="sidebar-item" data-nav="thispc">
        <div class="sidebar-icon pc"></div>
        <span>This PC</span>
      </div>
      <div class="sidebar-item active" data-nav="documents">
        <div class="sidebar-icon folder"></div>
        <span>Documents</span>
      </div>
      <div class="sidebar-item" data-nav="downloads">
        <div class="sidebar-icon downloads"></div>
        <span>Downloads</span>
      </div>
    </div>
    <div class="sidebar-section">
      <div class="sidebar-header">This PC</div>
      <div class="sidebar-item" data-nav="desktop">
        <div class="sidebar-icon folder"></div>
        <span>Desktop</span>
      </div>
      <div class="sidebar-item" data-nav="documents">
        <div class="sidebar-icon documents"></div>
        <span>Documents</span>
      </div>
      <div class="sidebar-item" data-nav="pictures">
        <div class="sidebar-icon pictures"></div>
        <span>Pictures</span>
      </div>
      <div class="sidebar-item" data-nav="music">
        <div class="sidebar-icon music"></div>
        <span>Music</span>
      </div>
      <div class="sidebar-item" data-nav="videos">
        <div class="sidebar-icon videos"></div>
        <span>Videos</span>
      </div>
    </div>
  `;
  
  // Content area
  const contentArea = document.createElement('div');
  contentArea.className = 'explorer-content';
  contentArea.id = 'folder-explorer-content-area';
  
  // Header
  const contentHeader = document.createElement('div');
  contentHeader.className = 'content-header';
  contentHeader.innerHTML = `
    <div></div>
    <div>Name</div>
    <div>Date modified</div>
    <div>Type</div>
  `;
  
  // Folder grid
  const folderGrid = document.createElement('div');
  folderGrid.className = 'folder-grid';
  folderGrid.id = 'folder-grid';
  
  // Function to render root folders
  function renderRootFolders() {
    folderGrid.innerHTML = '';
    const folders = [
      { name: 'Restricted', date: '2024-01-15 14:30', type: 'File folder', restricted: true, id: 'restricted' },
      { name: 'Images', date: '2024-03-20 09:15', type: 'File folder', restricted: false, id: 'images' },
      { name: 'Ar3ne', date: '2024-02-10 16:45', type: 'File folder', restricted: false, id: 'ar3ne' },
      { name: 'Assignments', date: '2024-04-05 11:20', type: 'File folder', restricted: false, id: 'assignments' },
      { name: 'Art', date: '2024-03-28 13:10', type: 'File folder', restricted: false, id: 'art' }
    ];
    
    folders.forEach(folder => {
      const folderItem = document.createElement('div');
      folderItem.className = 'folder-item' + (folder.restricted ? ' restricted' : '');
      folderItem.setAttribute('data-folder-id', folder.id);
      folderItem.innerHTML = `
        <div class="folder-icon"></div>
        <div class="folder-name">${folder.name}</div>
        <div class="folder-date">${folder.date}</div>
        <div class="folder-type">${folder.type}</div>
      `;
      
      // Add click handler for Ar3ne folder
      if (folder.id === 'ar3ne') {
        folderItem.addEventListener('dblclick', function(e) {
          e.stopPropagation();
          renderAr3neFiles();
          const addressText = document.getElementById('folder-address-text');
          if (addressText) {
            addressText.textContent = 'This PC > Documents > Ar3ne';
          }
        });
      }
      
      // Add click handler for Restricted folder
      if (folder.id === 'restricted') {
        folderItem.addEventListener('dblclick', function(e) {
          e.stopPropagation();
          alert('Access Denied: You do not have permission to access this folder.');
        });
      }
      
      folderGrid.appendChild(folderItem);
    });
    
    // Update status bar
    const statusLeft = document.querySelector('#folder-explorer-tab .status-left');
    if (statusLeft) {
      statusLeft.innerHTML = `<span>5 items</span><span>5 folders</span>`;
    }
  }
  
  // Function to render Ar3ne files
  function renderAr3neFiles() {
    folderGrid.innerHTML = '';
    
    const files = [
      { name: 'Report.txt', date: '2024-05-10 08:30', type: 'Text Document', icon: 'txt' },
      { name: 'Aqulia.jpg', date: '2024-05-12 14:22', type: 'JPEG Image', icon: 'img' },
      { name: 'Scream.wav', date: '2024-05-08 19:45', type: 'Wave Sound', icon: 'audio' },
      { name: 'Eye.mp4', date: '2024-05-15 23:11', type: 'MP4 Video', icon: 'video' }
    ];
    
    files.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.setAttribute('data-file-id', file.name);
      
      let iconStyle = '';
      if (file.icon === 'txt') {
        iconStyle = 'background-image: url("Applications/Notepad/Notepad.png");';
      } else if (file.icon === 'img') {
        iconStyle = 'background-image: url("Applications/Gallary/Gallary.png");';
      } else if (file.icon === 'audio') {
        iconStyle = 'background-image: url("Applications/Music/Music.png");';
      } else if (file.icon === 'video') {
        iconStyle = 'background-image: url("Sources/DesktopIcons/Videos.png");';
      }
      
      fileItem.innerHTML = `
        <div class="file-icon" style="${iconStyle}"></div>
        <div class="file-name">${file.name}</div>
        <div class="file-date">${file.date}</div>
        <div class="file-type">${file.type}</div>
      `;
      folderGrid.appendChild(fileItem);
    });
    
    // Update status bar
    const statusLeft = document.querySelector('#folder-explorer-tab .status-left');
    if (statusLeft) {
      statusLeft.innerHTML = `<span>4 items</span><span>4 files</span>`;
    }
  }
  
  renderRootFolders();
  
  contentArea.appendChild(contentHeader);
  contentArea.appendChild(folderGrid);
  
  main.appendChild(sidebar);
  main.appendChild(contentArea);
  
  // Status bar
  const statusbar = document.createElement('div');
  statusbar.className = 'explorer-statusbar';
  statusbar.innerHTML = `
    <div class="status-left">
      <span>5 items</span>
      <span>5 folders</span>
    </div>
    <div class="status-right">
      <div class="view-options">
        <button class="view-btn" title="Details"><img src="Sources/DesktopIcons/View.png" alt="Details" style="width:14px;height:14px;vertical-align:middle;filter:invert(1);"></button>
        <button class="view-btn" title="Icons"><img src="Sources/DesktopIcons/Icons.png" alt="Icons" style="width:14px;height:14px;vertical-align:middle;filter:invert(1);"></button>
        <button class="view-btn" title="List"><img src="Sources/DesktopIcons/List.png" alt="List" style="width:14px;height:14px;vertical-align:middle;filter:invert(1);"></button>
      </div>
    </div>
  `;
  
  explorer.appendChild(toolbar);
  explorer.appendChild(main);
  explorer.appendChild(statusbar);
  
  content.appendChild(explorer);
  tab.appendChild(header);
  tab.appendChild(content);
  container.appendChild(tab);
  
  // Add back button functionality
  const backBtn = toolbar.querySelector('#folder-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      renderRootFolders();
      const addressText = document.getElementById('folder-address-text');
      if (addressText) {
        addressText.textContent = 'This PC > Documents';
      }
    });
  }
  
  // Add up button functionality
  const upBtn = toolbar.querySelector('#folder-up-btn');
  if (upBtn) {
    upBtn.addEventListener('click', function() {
      renderRootFolders();
      const addressText = document.getElementById('folder-address-text');
      if (addressText) {
        addressText.textContent = 'This PC > Documents';
      }
    });
  }

  // === DRAG LOGIC ===
  header.addEventListener('mousedown', function(e) {
    startDrag(e, tab);
  });

  // === EVENT LISTENERS ===
  minBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleMinimize(tab);
  });

  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeTab(tab);
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
  if (musicTab) {
    musicTab.style.left = '50%';
    musicTab.style.top = '20vh';
    musicTab.style.width = '450px';
    musicTab.style.height = '550px';
    musicTab.style.transform = 'translateX(-50%)';
  }
}

function positionNotepadTab() {
  if (notepadTab) {
    notepadTab.style.left = '50%';
    notepadTab.style.top = '20vh';
    notepadTab.style.width = '600px';
    notepadTab.style.height = '500px';
    notepadTab.style.transform = 'translateX(-50%)';
  }
}

function positionPdfTab() {
  if (pdfTab) {
    pdfTab.style.left = '50%';
    pdfTab.style.top = '20vh';
    pdfTab.style.width = '700px';
    pdfTab.style.height = '600px';
    pdfTab.style.transform = 'translateX(-50%)';
  }
}

function positionFileExplorerTab() {
  if (fileExplorerTab) {
    fileExplorerTab.style.left = '50%';
    fileExplorerTab.style.top = '15vh';
    fileExplorerTab.style.width = '900px';
    fileExplorerTab.style.height = '650px';
    fileExplorerTab.style.transform = 'translateX(-50%)';
  }
}

function positionFolderExplorerTab() {
  if (folderExplorerTab) {
    folderExplorerTab.style.left = '50%';
    folderExplorerTab.style.top = '15vh';
    folderExplorerTab.style.width = '800px';
    folderExplorerTab.style.height = '600px';
    folderExplorerTab.style.transform = 'translateX(-50%)';
  }
}

// === DRAG FUNCTIONS ===
function startDrag(e, tab) {
  if (e.target.classList.contains('tab-btn')) return;  // Don't drag on buttons
  
  currentDragTab = tab;
  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  const rect = currentDragTab.getBoundingClientRect();
  tabStartX = rect.left;
  tabStartY = rect.top;
  
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
  if (!isDragging || !currentDragTab) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  currentDragTab.style.left = (tabStartX + dx) + 'px';
  currentDragTab.style.top = (tabStartY + dy) + 'px';
  currentDragTab.style.transform = 'none';
}

function stopDrag() {
  isDragging = false;
  currentDragTab = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}

// === MINIMIZE / CLOSE ===
function toggleMinimize(tab) {
  if (tab) tab.classList.toggle('minimized');
}

function closeTab(tab) {
  if (tab) {
    tab.remove();
    if (tab === musicTab) musicTab = null;
    else if (tab === notepadTab) notepadTab = null;
    else if (tab === pdfTab) pdfTab = null;
    else if (tab === fileExplorerTab) fileExplorerTab = null;
    else if (tab === folderExplorerTab) folderExplorerTab = null;
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

// =====================================================
// START MENU SYSTEM
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
  const homeButton = document.getElementById('home-button');
  const startMenu = document.getElementById('start-menu');
  
  // Toggle start menu on home button click
  if (homeButton && startMenu) {
    homeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      startMenu.classList.toggle('hidden');
    });
    
    // Close start menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!startMenu.contains(e.target) && !homeButton.contains(e.target)) {
        startMenu.classList.add('hidden');
      }
    });
    
    // Prevent start menu from closing when clicking inside it
    startMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
  
  // Handle start menu app clicks
  const startAppItems = document.querySelectorAll('[data-app]');
  startAppItems.forEach(item => {
    item.addEventListener('click', function() {
      const app = this.getAttribute('data-app');
      startMenu.classList.add('hidden');
      
      // Trigger corresponding app
      switch(app) {
        case 'thispc':
          document.getElementById('app1')?.click();
          break;
        case 'browser':
          document.getElementById('app2')?.click();
          break;
        case 'discord':
          document.getElementById('app3')?.click();
          break;
        case 'folder':
          document.getElementById('app4')?.click();
          break;
        case 'gallary':
          document.getElementById('app5')?.click();
          break;
        case 'notepad':
          document.getElementById('app6')?.click();
          break;
        case 'pdf':
          document.getElementById('app7')?.click();
          break;
        case 'terminal':
          document.getElementById('app8')?.click();
          break;
        case 'instagram':
          document.getElementById('app9')?.click();
          break;
        case 'music':
          document.getElementById('app10')?.click();
          break;
      }
    });
  });
});