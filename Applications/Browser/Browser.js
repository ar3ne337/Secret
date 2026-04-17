(function() {
    "use strict";
  
// ----- STATE MANAGEMENT -----
    let tabs = [];
    let activeTabId = null;
    let bookmarks = [];
  
    // DOM Elements
    const iframe = document.getElementById('browserFrame');
    const urlInput = document.getElementById('urlInput');
    const goBtn = document.getElementById('goBtn');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const homeBtn = document.getElementById('homeBtn');
    const newTabBtn = document.getElementById('newTabBtn');
    const tabsContainer = document.getElementById('tabsContainer');
    const bookmarksList = document.getElementById('bookmarksList');
    const addBookmarkBtn = document.getElementById('addBookmarkBtn');
    const bookmarkPageBtn = document.getElementById('bookmarkPageBtn');
    const securityBadge = document.getElementById('securityBadge');
    const connectionStatus = document.getElementById('connectionStatus');
    const pageStatus = document.getElementById('pageStatus');
    const urlDisplay = document.getElementById('urlDisplay');
    const progressFill = document.getElementById('progressFill');
    const overlay = document.getElementById('overlay');
    const bookmarkDialog = document.getElementById('bookmarkDialog');
    const bookmarkName = document.getElementById('bookmarkName');
    const bookmarkUrl = document.getElementById('bookmarkUrl');
    const cancelBookmark = document.getElementById('cancelBookmark');
    const saveBookmark = document.getElementById('saveBookmark');
  
    // ----- UTILITIES -----
    function generateId() { return Date.now() + '-' + Math.random().toString(36); }
  
    function processUrl(input) {
      let trimmed = input.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
      return 'https://' + trimmed;
    }
  
    function updateUIForUrl(url) {
      if (!url || url === 'about:newtab') {
        securityBadge.innerHTML = '<i class="fas fa-shield-alt"></i><span>A3</span>';
        connectionStatus.innerHTML = '<i class="fas fa-circle" style="color: #10B981; font-size: 8px;"></i><span>Connected</span>';
        urlDisplay.textContent = 'a3://welcome';
        return;
      }
      try {
        const u = new URL(url);
        urlDisplay.textContent = u.hostname;
        if (u.protocol === 'https:') {
          securityBadge.innerHTML = '<i class="fas fa-lock"></i><span>Secure</span>';
          connectionStatus.innerHTML = '<i class="fas fa-circle" style="color: #10B981; font-size: 8px;"></i><span>Secure HTTPS</span>';
        } else {
          securityBadge.innerHTML = '<i class="fas fa-lock-open"></i><span>HTTP</span>';
          connectionStatus.innerHTML = '<i class="fas fa-circle" style="color: #FBBF24; font-size: 8px;"></i><span>Not Secure</span>';
        }
      } catch(e) {
        urlDisplay.textContent = url;
      }
    }
  
    function startLoading() {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      
      isLoading = true;
      pageStatus.textContent = 'Loading...';
      progressFill.style.width = '60%';
      
      loadingTimeout = setTimeout(() => {
        if (isLoading) {
          stopLoading();
          pageStatus.textContent = 'Timeout';
          setTimeout(() => pageStatus.textContent = 'Ready', 1500);
        }
      }, 15000);
    }
  
    function stopLoading() {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
      }
      
      isLoading = false;
      pageStatus.textContent = 'Ready';
      progressFill.style.width = '100%';
      setTimeout(() => progressFill.style.width = '0%', 200);
    }
  
    // ----- LOAD URL -----
    function loadUrl(url) {
      if (!url) return;
      
      stopLoading();
      const processedUrl = processUrl(url);
      
      // Update UI
      urlInput.value = processedUrl;
      updateActiveTab(processedUrl, processedUrl);
      updateUIForUrl(processedUrl);
      
      // Load URL
      startLoading();
      setTimeout(() => {
        iframe.src = processedUrl;
      }, 50);
    }
  
    // ----- NEW TAB PAGE -----
    function loadNewTabPage() {
      stopLoading();
      const newTabHtml = `
        <html style="background:#0E0E12; height:100vh; width:100vw; overflow:hidden; font-family:system-ui;">
          <head><meta charset="UTF-8">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
          <style>*{margin:0;padding:0;box-sizing:border-box}html,body{overflow:hidden;height:100vh;width:100vw}</style></head>
          <body style="margin:0;background:linear-gradient(135deg,#0E0E12,#1A1A28);color:#E8E8EE;display:flex;align-items:center;justify-content:center;height:100vh;">
            <div style="text-align:center;max-width:900px;padding:20px;">
              <img src="https://a3os.pages.dev/Applications/Browser/A3BrowserLogo.png" style="width:100%;max-width:600px;border-radius:12px;margin-bottom:40px;">
              <div style="margin-bottom:30px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                <input type="text" id="urlInput" placeholder="Enter URL" style="flex:1;min-width:280px;max-width:500px;padding:16px 20px;background:#14141C;border:2px solid #282838;border-radius:12px;color:#FFF;font-size:16px;outline:none;" onkeypress="if(event.key==='Enter')navigate()">
                <button onclick="navigate()" style="padding:16px 30px;background:#3B82F6;border:none;border-radius:12px;color:#FFF;font-weight:600;cursor:pointer;font-size:16px;"><i class="fas fa-arrow-right"></i> Go</button>
              </div>
              <p style="color:#606070;margin-top:32px;font-size:0.85rem;">A3 Browser Pro · Fast · Private · Professional</p>
            </div>
            <script>
              function navigate() {
                const url = document.getElementById('urlInput').value.trim();
                if (url) window.parent.loadUrl(url);
              }
            <\/script>
          </body>
        </html>
      `;
      iframe.srcdoc = newTabHtml;
      urlInput.value = '';
      updateActiveTab('about:newtab', 'New Tab');
      updateUIForUrl('about:newtab');
    }
  
    // ----- TAB MANAGEMENT -----
    function renderTabs() {
      tabsContainer.innerHTML = '';
      tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === activeTabId ? 'active' : ''}`;
        const displayTitle = tab.title || 'New Tab';
        const shortTitle = displayTitle.length > 25 ? displayTitle.substring(0, 22) + '...' : displayTitle;
        tabEl.innerHTML = `
          <div class="tab-favicon"><i class="fas fa-globe"></i></div>
          <span class="tab-title">${shortTitle}</span>
          <button class="tab-close" data-tab-id="${tab.id}">×</button>
        `;
        tabEl.addEventListener('click', (e) => {
          if (!e.target.classList.contains('tab-close')) {
            switchTab(tab.id);
          }
        });
        tabEl.querySelector('.tab-close').addEventListener('click', (e) => {
          e.stopPropagation();
          closeTab(tab.id);
        });
        tabsContainer.appendChild(tabEl);
      });
    }
  
    function createTab(url = '', title = 'New Tab') {
      const id = generateId();
      tabs.push({ id, url, title });
      return id;
    }
  
    function switchTab(id) {
      activeTabId = id;
      const tab = tabs.find(t => t.id === id);
      if (tab) {
        if (tab.url && tab.url !== 'about:newtab') {
          iframe.src = tab.url;
          urlInput.value = tab.url;
          updateUIForUrl(tab.url);
        } else {
          loadNewTabPage();
        }
        renderTabs();
      }
    }
  
    function closeTab(id) {
      const index = tabs.findIndex(t => t.id === id);
      if (index === -1) return;
      
      tabs.splice(index, 1);
      if (tabs.length === 0) {
        const newId = createTab();
        activeTabId = newId;
        loadNewTabPage();
      } else if (activeTabId === id) {
        activeTabId = tabs[Math.min(index, tabs.length - 1)].id;
        switchTab(activeTabId);
      }
      renderTabs();
    }
  
    function updateActiveTab(url, title) {
      const tab = tabs.find(t => t.id === activeTabId);
      if (tab) {
        tab.url = url;
        tab.title = title || url;
        renderTabs();
      }
    }
  
    // ----- BOOKMARKS -----
    function renderBookmarks() {
      bookmarksList.innerHTML = '';
      bookmarks.forEach((bm) => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        item.innerHTML = `
          <div class="bookmark-icon"><i class="fas fa-bookmark"></i></div>
          <span class="bookmark-name">${bm.name}</span>
        `;
        item.addEventListener('click', () => loadUrl(bm.url));
        bookmarksList.appendChild(item);
      });
    }
  
    function addBookmark(name, url) {
      bookmarks.push({ name, url });
      renderBookmarks();
    }
  
    // Expose loadUrl globally for the new tab page
    window.loadUrl = loadUrl;
  
    // ----- EVENT LISTENERS -----
    goBtn.addEventListener('click', () => {
      const val = urlInput.value.trim();
      if (val) loadUrl(val);
    });
  
    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = urlInput.value.trim();
        if (val) loadUrl(val);
      }
    });
  
    backBtn.addEventListener('click', () => {
      // History UI placeholder
    });

    forwardBtn.addEventListener('click', () => {
      // History UI placeholder
    });
  
    refreshBtn.addEventListener('click', () => {
      const tab = tabs.find(t => t.id === activeTabId);
      if (tab && tab.url !== 'about:newtab') {
        stopLoading();
        startLoading();
        iframe.src = '';
        setTimeout(() => { iframe.src = tab.url; }, 50);
      } else {
        loadNewTabPage();
      }
    });
  
    homeBtn.addEventListener('click', loadNewTabPage);
  
    newTabBtn.addEventListener('click', () => {
      const newId = createTab();
      activeTabId = newId;
      loadNewTabPage();
      renderTabs();
    });
  
    iframe.addEventListener('load', () => {
      stopLoading();
      try {
        let loadedUrl = iframe.contentWindow.location.href;
        if (loadedUrl && !loadedUrl.startsWith('about:') && !loadedUrl.startsWith('data:')) {
          urlInput.value = loadedUrl;
          updateActiveTab(loadedUrl, loadedUrl);
          updateUIForUrl(loadedUrl);
        }
      } catch(e) {
        // Cross-origin - page still loaded successfully
      }
    });
  
    iframe.addEventListener('error', () => {
      stopLoading();
      pageStatus.textContent = 'Error';
      setTimeout(() => pageStatus.textContent = 'Ready', 2000);
    });
  
    // Bookmark dialog
    bookmarkPageBtn.addEventListener('click', () => {
      const currentUrl = urlInput.value;
      if (currentUrl && !currentUrl.startsWith('about:')) {
        bookmarkUrl.value = currentUrl;
        bookmarkName.value = urlDisplay.textContent || 'Bookmark';
        overlay.classList.add('active');
        bookmarkDialog.classList.add('active');
      }
    });
  
    addBookmarkBtn.addEventListener('click', () => {
      bookmarkUrl.value = '';
      bookmarkName.value = '';
      overlay.classList.add('active');
      bookmarkDialog.classList.add('active');
    });
  
    cancelBookmark.addEventListener('click', () => {
      overlay.classList.remove('active');
      bookmarkDialog.classList.remove('active');
    });
  
    saveBookmark.addEventListener('click', () => {
      const name = bookmarkName.value.trim();
      let url = bookmarkUrl.value.trim();
      
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      if (name && url) {
        addBookmark(name, url);
      }
      overlay.classList.remove('active');
      bookmarkDialog.classList.remove('active');
    });
  
    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      bookmarkDialog.classList.remove('active');
    });
  
    // Window controls
    document.querySelector('.window-btn.close').addEventListener('click', () => window.close());
    document.querySelector('.window-btn.maximize').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.querySelector('.browser-pro').requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  

  
    // Initialize
    const initialTabId = createTab();
    activeTabId = initialTabId;
    loadNewTabPage();
    renderTabs();
    
    renderBookmarks();
  })();