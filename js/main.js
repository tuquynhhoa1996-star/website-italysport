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

// Khung nhúng mục Giải đấu / Điểm năng lực (hoc-vien/, 28/10/2026): giữ hash của trang (link sâu), tự chỉnh chiều cao, đồng bộ hash ngược lên thanh địa chỉ.
(function(){
  var f=document.querySelector('iframe.app-nhung');if(!f)return;
  var h=location.hash&&location.hash.length>2?location.hash:f.getAttribute('data-hash');
  f.src=f.getAttribute('data-src')+h;
  function fit(){try{var d=f.contentDocument;if(!d||!d.body)return;var b=d.body,cs=d.defaultView.getComputedStyle(b);
    var hh=Math.ceil(b.getBoundingClientRect().height+parseFloat(cs.marginTop)+parseFloat(cs.marginBottom));
    if(hh>200&&Math.abs(f.offsetHeight-hh)>2)f.style.height=hh+'px';}catch(e){}}
  f.addEventListener('load',function(){fit();try{var w=f.contentWindow;
    if(w.ResizeObserver)new w.ResizeObserver(fit).observe(w.document.body);
    w.addEventListener('hashchange',function(){try{history.replaceState(null,'',location.pathname+location.search+w.location.hash);}catch(e){}
      var t=f.getBoundingClientRect().top;if(t<0)window.scrollTo(0,window.scrollY+t-80);setTimeout(fit,60);});
  }catch(e){}});
  setInterval(fit,700);
})();

// bang chuyen cam nhan phu huynh: nut truoc/sau cuon dung 1 the
document.querySelectorAll("[data-tm]").forEach(function (b) {
  var t = b.querySelector(".tm-track");
  function step(d) { var c = t.querySelector(".tm-card"); t.scrollBy({ left: d * (c ? c.getBoundingClientRect().width + 16 : 300), behavior: "smooth" }); }
  b.querySelector(".tm-prev").addEventListener("click", function () { step(-1); });
  b.querySelector(".tm-next").addEventListener("click", function () { step(1); });
});

// Form Đăng ký học thử (30/10/2026): gửi qua Apps Script, ghi vào Sheet nhận lead cũ + bản dự phòng. Lỗi thì chỉ hotline/landing, không mất dữ liệu người nhập.
(function(){
  var forms=document.querySelectorAll('form.ht-form');if(!forms.length)return;
  var T0=Date.now(),G=document.body.getAttribute('data-lead'),REG=document.body.getAttribute('data-reg'),HOT=document.body.getAttribute('data-hot');
  function ev(n,p){try{if(window.gtag)window.gtag('event',n,p||{});}catch(e){}}
  var S={};try{var q=new URLSearchParams(location.search),m={us:'utm_source',um:'utm_medium',uc:'utm_campaign',ux:'utm_content'};for(var k in m)S[k]=q.get(m[k])||sessionStorage.getItem('zl_'+k)||'';}catch(e){}
  var seen=false;
  function xem(){if(seen)return;seen=true;ev('xem_form_hoc_thu',{trang:location.pathname});}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){xem();io.disconnect();}});});forms.forEach(function(f){io.observe(f);});}
  forms.forEach(function(f){
    f.addEventListener('focusin',function(){ev('bat_dau_form_hoc_thu');},{once:true});
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var box=f.parentNode,btn=f.querySelector('button'),v=function(n){return (f.elements[n].value||'').trim();};
      var ten=v('ten'),sdt=v('sdt').replace(/[\s.\-]/g,''),tuoi=v('tuoi'),cs=v('cs');
      var err=f.querySelector('.ht-loi');if(err)err.remove();
      function loi(t){var d=document.createElement('p');d.className='ht-loi';d.setAttribute('role','alert');d.innerHTML=t;f.insertBefore(d,btn);}
      if(!/^(\+?84|0)\d{9}$/.test(sdt)){loi('Số điện thoại chưa đúng, bố mẹ nhập đủ 10 số giúp trung tâm.');return;}
      if(Date.now()-T0<2500){loi('Bố mẹ kiểm tra lại thông tin rồi bấm gửi lần nữa nhé.');return;}
      btn.disabled=true;var tx=btn.textContent;btn.textContent='Đang gửi...';
      var tr=location.pathname.split('/').pop()||'index.html';
      var u=G+'?lead=1&web=IS&ten='+encodeURIComponent(ten)+'&sdt='+encodeURIComponent(sdt)+'&tuoi='+encodeURIComponent(tuoi)+'&cs='+encodeURIComponent(cs)+'&tr='+encodeURIComponent(tr);
      for(var k in S)if(S[k])u+='&'+k+'='+encodeURIComponent(S[k]);
      var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){ctl&&ctl.abort();},15000);
      fetch(u,ctl?{signal:ctl.signal}:{}).then(function(r){return r.text();}).then(function(t){
        clearTimeout(tm);
        if(t.trim()!=='ok')throw 0;
        ev('generate_lead',{trang:tr,co_so:cs});ev('gui_form_hoc_thu',{trang:tr});
        var po=document.getElementById('pop');
        f.outerHTML='<div class="ht-ok" role="status"><h3>Đã nhận thông tin của bố mẹ</h3><p>Cảm ơn bố mẹ đã đăng ký học thử cho con. Các bước tiếp theo:</p><ol><li>Trung tâm gọi lại cho bố mẹ trong ngày (giờ hành chính 8:00-17:30) để xếp buổi học thử ở cơ sở gần nhà.</li><li>Bố mẹ nghe máy số lạ giúp trung tâm. Nếu lỡ cuộc gọi, bố mẹ gọi lại hotline <a href="tel:'+HOT.split('|')[0]+'">'+HOT.split('|')[1]+'</a>.</li><li>Ngày học thử, cho con đi giày thể thao, mang nước uống và có mặt trước 10-15 phút.</li></ol></div>';
      }).catch(function(){
        clearTimeout(tm);btn.disabled=false;btn.textContent=tx;ev('loi_form_hoc_thu',{trang:tr});
        loi('Chưa gửi được thông tin (mạng chậm hoặc lỗi tạm). Thông tin bố mẹ vừa nhập vẫn còn, bố mẹ bấm gửi lại hoặc gọi hotline <a href="tel:'+HOT.split('|')[0]+'">'+HOT.split('|')[1]+'</a>,.');
      });
    });
  });
})();
