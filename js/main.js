(function(){
  var b=document.querySelector('.burger'),m=document.querySelector('nav.menu');
  if(b&&m){b.addEventListener('click',function(){m.classList.toggle('open');b.setAttribute('aria-expanded',m.classList.contains('open'));});}
  var lb=document.createElement('div');lb.className='lb';lb.innerHTML='<img alt="">';document.body.appendChild(lb);
  lb.addEventListener('click',function(){lb.classList.remove('on');});
  document.querySelectorAll('.gal a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();lb.querySelector('img').src=a.getAttribute('href');lb.classList.add('on');});});
})();

// bổ sung 28/10/2026: popup học thử + lọc lịch học
(function(){
  var pop=document.getElementById('pop');
  if(pop){
    var go=document.getElementById('pop-go'),sel=document.getElementById('pop-cs');
    function open(){pop.hidden=false;try{sessionStorage.setItem('pop','1');}catch(e){}}
    function close(){pop.hidden=true;}
    document.querySelectorAll('[data-pop]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open();});});
    pop.querySelector('.pop-x').addEventListener('click',close);
    pop.addEventListener('click',function(e){if(e.target===pop)close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
    if(sel&&go){sel.addEventListener('change',function(){var b=go.getAttribute('data-base');go.href=sel.value?b+'&utm_term='+encodeURIComponent(sel.value):b;});}
    go&&go.addEventListener('click',function(){setTimeout(close,300);});
    var seen=false;try{seen=sessionStorage.getItem('pop')==='1';}catch(e){}
    if(document.body.getAttribute('data-autopop')&&!seen&&!/[?&]nopop/.test(location.search)){setTimeout(function(){if(pop.hidden)open();},20000);}
  }
  var L=document.querySelector('.lich');
  if(L){
    var sels=L.querySelectorAll('select[data-f]'),rows=L.querySelectorAll('tbody tr'),n=L.querySelector('.lich-n');
    function f(){var v={};sels.forEach(function(s){v[s.getAttribute('data-f')]=s.value;});var c=0;
      rows.forEach(function(r){var ok=(!v.cs||r.getAttribute('data-cs')===v.cs)&&(!v.kh||r.getAttribute('data-kh')===v.kh);r.classList.toggle('hide',!ok);if(ok)c++;});
      n.textContent=c?('Đang hiện '+c+' lớp. Chọn "Tất cả" để xem lại toàn bộ.'):'Chưa có lớp khớp lựa chọn này. Gọi hotline để cô tư vấn.';}
    sels.forEach(function(s){s.addEventListener('change',f);});f();
  }
})();
// Nút Zalo (z.html, đếm lượt bấm): gắn trang hiện tại + utm/nguồn vào link (28/10/2026)
(function(){try{var S=sessionStorage,q=new URLSearchParams(location.search),m={us:'utm_source',um:'utm_medium',uc:'utm_campaign',ux:'utm_content'},k;
  for(k in m)if(q.get(m[k]))S.setItem('zl_'+k,q.get(m[k]).slice(0,100));
  var r=document.referrer;if(r&&!S.getItem('zl_ref')){try{if(new URL(r).host!==location.host)S.setItem('zl_ref',r.slice(0,200));}catch(e){}}
  var tr=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('a[href^="z.html"]').forEach(function(a){var u=a.getAttribute('href')+'&tr='+encodeURIComponent(tr);
    for(var k in m){var v=S.getItem('zl_'+k);if(v)u+='&'+k+'='+encodeURIComponent(v);}
    var f=S.getItem('zl_ref');if(f)u+='&ref='+encodeURIComponent(f);a.setAttribute('href',u);});
}catch(e){}})();
