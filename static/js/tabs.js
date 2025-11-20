(function(){
  const GLOBAL_KEY = 'ac_global_tab_choice';
  const GROUP_KEY_PREFIX_TAB = 'ac_tab_';
  const GROUP_KEY_PREFIX_MODE = 'ac_mode_';
  const REGISTRY = []; // { groupId, panelData, activateByKey }

  function norm(str){
    return (str||'').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();
  }

  function parseQueryChoices(){
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('tabs');
    if(!raw) return null;
    return raw.split(',').map(s=>norm(s)).filter(Boolean);
  }

  function enhanceAll(){
    const queryChoices = parseQueryChoices();
    const containers = document.querySelectorAll('[data-tabs], [data-modes]');
    containers.forEach(c=>enhanceContainer(c, queryChoices));
  }

  function enhanceContainer(container, queryChoices){
    const isTabs = container.hasAttribute('data-tabs');
    const panelSelector = isTabs ? '[data-tab-panel]' : '[data-mode-panel]';
    const panels = Array.from(container.querySelectorAll(panelSelector));
    if(!panels.length) return;

    let groupId = container.getAttribute(isTabs ? 'data-tabs-id' : 'data-modes-id');
    if(!groupId){
      const base = panels.map(p=>norm(p.getAttribute('data-title'))).join('-').slice(0,40) || (isTabs?'tabs':'modes');
      groupId = base + '-' + REGISTRY.length + '-' + Date.now().toString(36);
    }

    const storagePrefix = isTabs ? GROUP_KEY_PREFIX_TAB : GROUP_KEY_PREFIX_MODE;
    const storedGroup = localStorage.getItem(storagePrefix + groupId);
    const pageDefaults = container.getAttribute('data-page-defaults');
    const pageDefaultsArray = pageDefaults ? pageDefaults.split(',').map(s=>norm(s)).filter(Boolean) : null;
    const forceTabs = container.hasAttribute('data-force-tabs');
    console.log('Container force-tabs attribute:', forceTabs, 'Page defaults array:', pageDefaultsArray);

    const nav = document.createElement('div');
    nav.className = 'ac-tablist';
    nav.setAttribute('role','tablist');

    const panelData = panels.map((panel, idx)=>{
      const rawTitle = panel.getAttribute('data-title') || ('Tab '+(idx+1));
      const key = norm(rawTitle);
      console.log('Panel', idx, '- Raw title:', rawTitle, 'Normalized key:', key);
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='ac-tab';
      btn.id = groupId + '-tab-' + idx;
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-selected','false');
      btn.setAttribute('tabindex','-1');
      btn.setAttribute('aria-controls', groupId + '-panel-' + idx);
      btn.textContent = rawTitle;
      btn.addEventListener('click', ()=>activate(idx,true));
      nav.appendChild(btn);

      panel.id = groupId + '-panel-' + idx;
      panel.setAttribute('role','tabpanel');
      panel.setAttribute('tabindex','0');
      panel.setAttribute('aria-labelledby', btn.id);
      return {panel, btn, key, rawTitle};
    });

    container.prepend(nav);

    function activate(index,user,skipPropagate){
      panelData.forEach((pd,i)=>{
        const active = i===index;
        pd.panel.style.display = active ? 'block' : 'none';
        pd.panel.classList.toggle('is-active-panel', active);
        pd.btn.setAttribute('aria-selected', active?'true':'false');
        pd.btn.classList.toggle('is-active', active);
        pd.btn.setAttribute('tabindex', active?'0':'-1');
      });
      const chosen = panelData[index];
      localStorage.setItem(storagePrefix + groupId, chosen.key);
      if(user){
        localStorage.setItem(GLOBAL_KEY, chosen.key);
        updateUrl(chosen.key);
        if(!skipPropagate){
          REGISTRY.forEach(r=>{ r.activateByKey(chosen.key); });
        }
      }
    }

    function updateUrl(key){
      try {
        const url = new URL(window.location.href);
        if(url.searchParams.get('tabs') !== key){
          url.searchParams.set('tabs', key);
          window.history.replaceState({},'',url.toString());
        }
      } catch(e) { /* ignore */ }
    }

    function findIndexByKey(k){ return panelData.findIndex(pd=>pd.key===k); }

    // Determine initial index with new priority system
    let initialIndex = 0;
    const globalChoice = localStorage.getItem(GLOBAL_KEY);

    if(forceTabs){
      // Force tabs mode: ignore all user preferences, use page defaults or first tab
      console.log('Force tabs enabled. Page defaults:', pageDefaultsArray);
      if(pageDefaultsArray && pageDefaultsArray.length){
        for(const pd of pageDefaultsArray){
          const idx = findIndexByKey(pd);
          console.log('Checking page default:', pd, 'found index:', idx);
          if(idx>=0){ initialIndex = idx; break; }
        }
      }
      console.log('Force tabs final index:', initialIndex);
      // If no page defaults found, stick with first tab (initialIndex = 0)
    } else if(queryChoices && queryChoices.length){
      // URL parameters take highest priority when not forcing
      for(const qc of queryChoices){ const idx = findIndexByKey(qc); if(idx>=0){ initialIndex = idx; break; } }
    } else if(storedGroup && findIndexByKey(storedGroup)>=0){
      // User's stored preference for this specific group
      initialIndex = findIndexByKey(storedGroup);
    } else if(globalChoice && findIndexByKey(globalChoice)>=0){
      // User's global preference
      initialIndex = findIndexByKey(globalChoice);
    } else if(pageDefaultsArray && pageDefaultsArray.length){
      // Page front matter defaults as fallback
      for(const pd of pageDefaultsArray){ const idx = findIndexByKey(pd); if(idx>=0){ initialIndex = idx; break; } }
    }
    // Final fallback: initialIndex remains 0 (first tab)

    // Register before activation so propagation can reach us if needed later.
    REGISTRY.push({
      groupId,
      panelData,
      activateByKey: (key)=>{ const idx = findIndexByKey(key); if(idx>=0) activate(idx,false,true); }
    });

    activate(initialIndex,false,true); // initial, no propagation

    // Keyboard navigation
    nav.addEventListener('keydown', e=>{
      const current = panelData.findIndex(pd=>pd.btn.classList.contains('is-active'));
      let target = null;
      if(e.key==='ArrowRight') target = (current+1)%panelData.length;
      else if(e.key==='ArrowLeft') target = (current-1+panelData.length)%panelData.length;
      else if(e.key==='Home') target = 0;
      else if(e.key==='End') target = panelData.length-1;
      if(target!==null){ e.preventDefault(); panelData[target].btn.focus(); activate(target,true); }
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', enhanceAll);
  } else {
    enhanceAll();
  }
})();
