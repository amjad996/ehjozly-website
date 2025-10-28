(function(){
  const root = document.documentElement;
  const arBtn = document.getElementById('btn-ar');
  const enBtn = document.getElementById('btn-en');
  const heroCta = document.getElementById('primary-cta');
  const searchBar = document.querySelector('.search-bar');
  const soonPop = document.getElementById('soon-pop');
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const isContactPage = !!document.getElementById('contact-form') || !!document.getElementById('map');

  // i18n map
  const dict = {
    ar: {
      // nav
      navHome: 'الرئيسية', navServices: 'الخدمات', navPricing: 'الأسعار', navFAQ: 'الأسئلة', navAbout: 'من نحن', navContact: 'تواصل',
      tagline: 'رحلتك تبدأ من هنا',
      heroTitle: 'احجز رحلتك أو أرسل طردك بثقة وسهولة',
      startNow: 'ابدأ الآن',
      soon: 'قريبًا نبدأ العمل 🚀',
      from: 'من', to: 'إلى', date: 'التاريخ', passengers: 'عدد الركاب', search: 'بحث',
      usp1: 'احجز بسهولة', usp2: 'وصّل شحنتك', usp3: 'بسرعة', usp4: 'بأمان', usp5: 'بثقة',
      comingSoon: 'قادم قريبًا', comingSoonSub: 'نعمل على إطلاق التجربة الكاملة قريبًا. ترقّبونا!',
      days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثوانٍ',
      // how it works
      howitTitle: 'كيف تعمل إحجُزلي؟', howitSub: 'أربع خطوات بسيطة لبدء رحلتك أو إرسال طردك.',
      howit1Title: 'اختر الوجهة', howit1Text: 'حدّد من وإلى والتاريخ وعدد الركاب أو نوع الشحنة.',
      howit2Title: 'قارن الخيارات', howit2Text: 'اطّلع على الرحلات أو مسارات الشحن بسهولة وشفافية.',
      howit3Title: 'احجز أو أرسل', howit3Text: 'أكمل الإجراءات ببضع نقرات. الدفع يتوفر قريبًا.',
      howit4Title: 'تتبّع واستلم', howit4Text: 'تابع الحالة أولًا بأول حتى الوصول بأمان.'
    },
    en: {
      // nav
      navHome: 'Home', navServices: 'Services', navPricing: 'Pricing', navFAQ: 'FAQ', navAbout: 'About', navContact: 'Contact',
      tagline: 'Your Trip Starts Here',
      heroTitle: 'Book your trip or send a parcel with confidence and ease',
      startNow: 'Start Now',
      soon: 'Launching soon 🚀',
      from: 'From', to: 'To', date: 'Date', passengers: 'Passengers', search: 'Search',
      usp1: 'Book easily', usp2: 'Ship parcels', usp3: 'Fast', usp4: 'Safe', usp5: 'Trusted',
      comingSoon: 'Coming Soon', comingSoonSub: 'We are launching the full experience soon. Stay tuned!',
      days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds',
      // how it works
      howitTitle: 'How it works', howitSub: 'Four simple steps to start your trip or send a parcel.',
      howit1Title: 'Choose destination', howit1Text: 'Set from, to, date, and passengers or parcel type.',
      howit2Title: 'Compare options', howit2Text: 'Browse trips or shipping routes clearly.',
      howit3Title: 'Book or ship', howit3Text: 'Complete in a few clicks. Payments arriving soon.',
      howit4Title: 'Track and receive', howit4Text: 'Follow status until safe arrival.'
    }
  };

  function setLang(lang){
    const isAr = lang === 'ar';
    document.documentElement.lang = isAr ? 'ar' : 'en';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    arBtn.classList.toggle('is-active', isAr);
    enBtn.classList.toggle('is-active', !isAr);
    const t = dict[lang];
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(t[key]) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{
      const key = el.getAttribute('data-i18n-title');
      if(t[key]) el.setAttribute('title', t[key]);
    });
  }

  // Language toggle
  if(arBtn && arBtn.tagName !== 'A'){
    arBtn.addEventListener('click', ()=> setLang('ar'));
  }
  if(enBtn && enBtn.tagName !== 'A'){
    enBtn.addEventListener('click', ()=> setLang('en'));
  }

  // Disabled interactions popup
  function showSoon(anchor){
    if(!anchor || !soonPop || !anchor.getBoundingClientRect) return;
    const r = anchor.getBoundingClientRect();
    soonPop.style.position = 'fixed';
    soonPop.style.left = (r.left + r.width/2 - 70) + 'px';
    soonPop.style.top = (r.bottom + 8) + 'px';
    soonPop.classList.add('show');
    clearTimeout(showSoon._t);
    showSoon._t = setTimeout(()=> soonPop.classList.remove('show'), 1500);
  }
  ['click','focus','mouseenter','touchstart'].forEach(evt=>{
    if(heroCta){ heroCta.addEventListener(evt, e=>{ e.preventDefault(); showSoon(heroCta); }); }
    if(searchBar){ searchBar.addEventListener(evt, e=>{ e.preventDefault(); showSoon(searchBar); }); }
  });

  // Reveal on scroll
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, {threshold: .12});
  revealEls.forEach(el=> io.observe(el));

  // Countdown (configurable)
  const countdownSection = document.getElementById('coming-soon');
  const cdEls = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs')
  };
  // Set target date (editable)
  const target = new Date();
  target.setDate(target.getDate() + 30); // 30 days from now by default

  function updateCountdown(){
    const now = new Date();
    const diff = target - now;
    if(diff <= 0){
      countdownSection.style.display = 'none';
      return;
    }
    const d = Math.floor(diff / (1000*60*60*24));
    const h = Math.floor((diff / (1000*60*60)) % 24);
    const m = Math.floor((diff / (1000*60)) % 60);
    const s = Math.floor((diff / 1000) % 60);
    cdEls.d.textContent = String(d).padStart(2,'0');
    cdEls.h.textContent = String(h).padStart(2,'0');
    cdEls.m.textContent = String(m).padStart(2,'0');
    cdEls.s.textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Initial language respects document lang
  const initialLang = (document.documentElement.lang || 'ar').toLowerCase().startsWith('en') ? 'en' : 'ar';
  setLang(initialLang);

  // Contact form mailto submit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const isEn = (document.documentElement.lang || initialLang) === 'en';
      const nameEl = document.getElementById('cf-name');
      const emailEl = document.getElementById('cf-email');
      const msgEl = document.getElementById('cf-message');
      const name = nameEl ? nameEl.value : '';
      const email = emailEl ? emailEl.value : '';
      const message = msgEl ? msgEl.value : '';
      // simple validation
      if(!name || !email || !message){
        alert(isEn ? 'Please fill in all fields.' : 'يرجى تعبئة جميع الحقول.');
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailPattern.test(email)){
        alert(isEn ? 'Please enter a valid email.' : 'يرجى إدخال بريد إلكتروني صحيح.');
        return;
      }
      const subject = encodeURIComponent(isEn ? `Website Contact – ${name || 'No name'}` : `تواصل عبر الموقع – ${name || 'بدون اسم'}`);
      const bodyLines = [
        isEn ? `Name: ${name}` : `الاسم: ${name}`,
        isEn ? `Email: ${email}` : `البريد: ${email}`,
        '',
        isEn ? 'Message:' : 'الرسالة:',
        message
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      window.location.href = `mailto:info@ehjozly.com?subject=${subject}&body=${body}`;
    });
  }

  // Leaflet interactive map centered on Syria
  const mapEl = document.getElementById('map');
  function injectIframeFallback(){
    if(!mapEl) return;
    // If provider was previously forced to iframe, allow Leaflet now
    const isEn = (document.documentElement.lang || initialLang) === 'en';
    const title = isEn ? 'Syria Map' : 'خريطة سوريا';
    // Google Maps embed centered on Syria
    const src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5546191.821319189!2d35.01!3d35.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1523d0b2f3b6f0b5%3A0x81f0e88e2c6f0!2sSyria!5e0!3m2!1sen!2s!4v0000000000000';
    mapEl.innerHTML = `<iframe title="${title}" src="${src}" width="100%" height="100%" style="border:0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  }
  (function initMap(){
    if(!mapEl) return;
    try{
      if (typeof L === 'undefined') { injectIframeFallback(); return; }
      const map = L.map('map', {scrollWheelZoom:true}).setView([35.0, 38.5], 6.5);
      // Use single-host OSM tiles to avoid subdomain blocks
      const tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' });
      let tileErrored = false;
      let tilesLoaded = false;
      const tileLoadHandler = function(){ tilesLoaded = true; };
      tile.on('load', tileLoadHandler);
      tile.on('tileerror', function(){
        tileErrored = true;
        injectIframeFallback();
      });
      tile.addTo(map);
      // Timed fallback if tiles don't load promptly
      setTimeout(()=>{ if(!tilesLoaded && !tileErrored) injectIframeFallback(); }, 2000);
      const places = [
        {nameAr:'دمشق', nameEn:'Damascus', coords:[33.5138,36.2765]},
        {nameAr:'حلب', nameEn:'Aleppo', coords:[36.2021,37.1343]},
        {nameAr:'حمص', nameEn:'Homs', coords:[34.7308,36.7097]},
        {nameAr:'إدلب', nameEn:'Idlib', coords:[35.9306,36.6339]},
        {nameAr:'اللاذقية', nameEn:'Latakia', coords:[35.5306,35.7900]}
      ];
      const isEn = (document.documentElement.lang || initialLang) === 'en';
      places.forEach(p=>{ if(!tileErrored) L.marker(p.coords).addTo(map).bindPopup(isEn ? p.nameEn : p.nameAr); });
    }catch(err){
      injectIframeFallback();
    }
  })();

  // Final fallback message if nothing rendered (e.g., file:// restrictions)
  setTimeout(()=>{
    if(mapEl && mapEl.children.length === 0){
      const isEn = (document.documentElement.lang || initialLang) === 'en';
      mapEl.style.display = 'flex';
      mapEl.style.alignItems = 'center';
      mapEl.style.justifyContent = 'center';
      mapEl.style.color = '#4a4e57';
      mapEl.innerHTML = isEn
        ? 'Map could not load. Please try with an internet connection or open the site via a local server (http). Locations: Damascus, Aleppo, Homs, Idlib, Latakia.'
        : 'تعذّر تحميل الخريطة. يرجى التأكّد من الاتصال بالإنترنت أو فتح الموقع عبر خادم محلي (http). المواقع: دمشق، حلب، حمص، إدلب، اللاذقية.';
    }
  }, 2000);
})();


