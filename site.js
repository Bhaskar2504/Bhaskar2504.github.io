/* Collapsible primary navigation for narrow screens. Without JS the full nav stays visible. */
(function(){
  var btn=document.querySelector('.nav-toggle'),nav=document.getElementById('primary-nav');
  if(!btn||!nav)return;
  document.documentElement.classList.add('js-nav');
  btn.hidden=false;
  function set(open){btn.setAttribute('aria-expanded',open);btn.textContent=open?'Close':'Menu';document.documentElement.classList.toggle('nav-open',open);}
  btn.addEventListener('click',function(){set(btn.getAttribute('aria-expanded')!=='true');});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){set(false);btn.focus();}});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
  matchMedia('(min-width:981px)').addEventListener('change',function(m){if(m.matches)set(false);});
})();
