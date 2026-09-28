/* Site navigation behaviour.
   - Grouped menus are <details>, so they work without JS; JS adds one-open-at-a-time,
     outside-click and Esc closing.
   - Header gains a shadow once the page scrolls.
   - At <=980px the nav becomes a slide-in panel with a backdrop, scroll lock and focus trap.
   - The logo intro animation plays on the first page view of a visit only. */
(function(){
  var doc=document.documentElement;
  var header=document.querySelector('.site-header');
  var groups=[].slice.call(document.querySelectorAll('.nav-group'));
  var btn=document.querySelector('.nav-toggle');
  var nav=document.getElementById('primary-nav');
  var label=btn&&btn.querySelector('.nav-toggle-label');
  var mobile=matchMedia('(max-width:980px)');

  /* Logo intro, once per session */
  try{if(!sessionStorage.getItem('brandIntro')){doc.classList.add('brand-intro');sessionStorage.setItem('brandIntro','1');}}catch(e){}

  /* Shadow on scroll */
  if(header){
    var ticking=false;
    var onScroll=function(){header.classList.toggle('is-scrolled',window.scrollY>8);ticking=false;};
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
    onScroll();
  }

  /* Dropdown groups */
  function closeGroups(except){groups.forEach(function(g){if(g!==except)g.open=false;});}
  groups.forEach(function(g){g.addEventListener('toggle',function(){if(g.open&&!mobile.matches)closeGroups(g);});});
  document.addEventListener('click',function(e){if(!mobile.matches&&!e.target.closest('.nav-group'))closeGroups();});

  if(!btn||!nav)return;

  /* Slide-in panel */
  doc.classList.add('js-nav');
  btn.hidden=false;
  var backdrop=document.createElement('div');
  backdrop.className='nav-backdrop';
  document.body.appendChild(backdrop);

  function isOpen(){return btn.getAttribute('aria-expanded')==='true';}
  /* A closed slide-in panel is inert: unreachable by Tab and hidden from screen readers
     regardless of animation state. On desktop the nav is never inert. */
  function syncInert(){nav.inert=mobile.matches&&!isOpen();}
  function setMenu(open){
    btn.setAttribute('aria-expanded',open);
    nav.inert=mobile.matches&&!open;
    btn.setAttribute('aria-label',open?'Close menu':'Open menu');
    if(label)label.textContent=open?'Close':'Menu';
    doc.classList.toggle('nav-open',open);
    if(open){
      var cur=document.querySelector('.nav-group.is-current');
      if(cur)cur.open=true;
      var first=nav.querySelector('summary,a');
      if(first)first.focus({preventScroll:true});
    }
  }
  btn.addEventListener('click',function(){setMenu(!isOpen());});
  backdrop.addEventListener('click',function(){setMenu(false);btn.focus();});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
  mobile.addEventListener('change',function(m){if(!m.matches)setMenu(false);syncInert();});
  window.addEventListener('resize',syncInert,{passive:true});
  syncInert();

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      if(isOpen()){setMenu(false);btn.focus();return;}
      var open=groups.filter(function(g){return g.open;})[0];
      if(open){open.open=false;open.querySelector('summary').focus();}
      return;
    }
    /* Keep Tab inside the open panel (plus the toggle button) */
    if(e.key==='Tab'&&isOpen()){
      var items=[btn].concat([].slice.call(nav.querySelectorAll('summary,a'))).filter(function(el){return el.offsetParent!==null;});
      var first=items[0],last=items[items.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
})();
