/* Site navigation: dropdown groups (details/summary) and a collapsible menu on narrow screens.
   Without JS every group still opens and the full nav stays reachable. */
(function(){
  var groups=[].slice.call(document.querySelectorAll('.nav-group'));
  groups.forEach(function(g){
    g.addEventListener('toggle',function(){if(g.open)groups.forEach(function(o){if(o!==g)o.open=false;});});
  });
  document.addEventListener('click',function(e){if(!e.target.closest('.nav-group,.nav-toggle'))groups.forEach(function(g){g.open=false;});});
  var btn=document.querySelector('.nav-toggle'),nav=document.getElementById('primary-nav');
  function setMenu(open){if(!btn)return;btn.setAttribute('aria-expanded',open);btn.textContent=open?'Close':'Menu';document.documentElement.classList.toggle('nav-open',open);
    if(open){var cur=document.querySelector('.nav-group.is-current');if(cur)cur.open=true;}}
  document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;
    var o=groups.filter(function(g){return g.open;})[0];if(o){o.open=false;o.querySelector('summary').focus();return;}
    if(btn&&btn.getAttribute('aria-expanded')==='true'){setMenu(false);btn.focus();}});
  if(!btn||!nav)return;
  document.documentElement.classList.add('js-nav');
  btn.hidden=false;
  btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true');});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
  matchMedia('(min-width:981px)').addEventListener('change',function(m){if(m.matches)setMenu(false);});
})();
