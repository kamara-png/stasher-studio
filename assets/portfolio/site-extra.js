/* Final content and interaction layer. Loaded on every page from <head>. */
(function () {
  'use strict';

  /* Keep the site's animation wrappers (ts-w/ts-c, mask/up, pp-lmask) intact when
     replacing copy, otherwise the blur and line-reveal animations stop working. */
  function set(el, text) {
    if (!el) return;
    if (el.textContent === text) return;
    var hadTs = !!el.querySelector('.ts-w');
    var hadUp = !!el.querySelector('.up');
    var hadLines = !!el.querySelector('.pp-lmask');
    var labelled = el.hasAttribute('aria-label');
    el.textContent = '';
    if (hadTs) {
      var w = document.createElement('span');
      w.className = 'ts-w';
      w.setAttribute('aria-hidden', 'true');
      var c = document.createElement('span');
      c.className = 'ts-c';
      c.textContent = text;
      w.appendChild(c);
      el.appendChild(w);
    } else if (hadUp) {
      var m = document.createElement('span');
      m.className = 'mask';
      var u = document.createElement('span');
      u.className = 'up';
      u.textContent = text;
      m.appendChild(u);
      el.appendChild(m);
    } else if (hadLines) {
      var words = text.split(/\s+/), line = '', lines = [];
      words.forEach(function (word) {
        if (!line) line = word;
        else if ((line + ' ' + word).length <= 42) line += ' ' + word;
        else { lines.push(line); line = word; }
      });
      if (line) lines.push(line);
      lines.forEach(function (l) {
        var mask = document.createElement('span');
        mask.className = 'pp-lmask';
        mask.setAttribute('aria-hidden', 'true');
        var inner = document.createElement('span');
        inner.className = 'pp-ln';
        inner.textContent = l;
        mask.appendChild(inner);
        el.appendChild(mask);
      });
    } else {
      el.textContent = text;
    }
    if (labelled) el.setAttribute('aria-label', text);
  }
  function rows(sel, values, prop) {
    var els = [].slice.call(document.querySelectorAll(sel));
    els.forEach(function (el, i) {
      if (values[i] !== undefined) set(el, values[i]);
      if (prop && values[i] !== undefined) el.setAttribute(prop, values[i]);
    });
  }

  var SERVICES = {
    '/services/saas-product-design': {
      title: 'Brand <em>Identity</em>',
      lead: 'A brand that looks like you, works on a sign and still holds up as a 32px avatar. I build identity systems from the mark out: logo, type, colour, rules and the applications that make them stick.',
      run: ['Logo & marks', 'Guidelines', 'Applications', 'Motion & 3D'],
      texts: [
        'A primary mark plus the lockups, symbols and favicons a brand actually needs. Drawn as vectors, so they scale from a business card to a storefront.',
        'A short, usable document: colour values, type, clear space and the do and don’t examples that keep the identity consistent when other people pick it up.',
        'Signage, embroidery, business cards, certificates and social kits. Q Lounge, CMM Bible College and Generation Now were built for real surfaces, not just a slide.',
        'Where it helps, the identity moves. The low-poly STASHER raccoon and Blender-built marks carry a brand into motion and interactive work.'
      ],
      cases: [
        ['Brand <em>Identity</em>', 'Q Lounge', 'Brand identity', '/work/q-lounge', '/media/categories/logos/11-qlounge.webp'],
        ['Brand <em>Identity</em>', 'Clarence Matheny Ministries', 'Logo & guidelines', '/work/logos', '/media/categories/logos/01-cmm-logo.webp'],
        ['Brand <em>Identity</em>', 'STASHER brand kit', 'Identity system', '/work/logos', '/media/categories/logos/10-stasher-logo.webp'],
        ['Brand <em>Identity</em>', 'Generation Now', 'Brand identity', '/work/logos', '/media/categories/logos/18-generationnow.webp']
      ],
      steps: [
        ['Brief', 'A chat on WhatsApp or email with references, goals and a deadline, plus a free 15-minute call if it helps.'],
        ['Concepts', '2–3 directions in 2–4 days, starting with the logo or one key layout so the direction is clear early.'],
        ['Refine', 'Structured revisions with mockups on real surfaces: signage, shirts or screens.'],
        ['Deliver', 'Final AI/PSD/Figma or Blend source, exports and a short guidelines document, with support after handover.']
      ],
      faq: [
        ['How long does a logo or identity take?', 'A logo takes 3–7 days and a full identity 1–3 weeks. Rush work can be arranged when the brief is clear.'],
        ['How do you price branding?', 'I take a 50% deposit via M-Pesa and the balance on delivery. I quote after the brief so scope and price are agreed up front.'],
        ['What files do I get?', 'Editable source (Illustrator, Photoshop, Figma or Blender), final PNG/JPG/PDF exports and a short guidelines document.'],
        ['Do you take 3D or motion work?', 'Yes. Blender assets, UI scenes, 2D art and edited stills alongside branding and posters.'],
        ['Can you work remotely?', 'Yes. I’m in Nairobi and work with clients worldwide over WhatsApp, Discord and email. I usually reply within 24 hours.']
      ],
      cta: ['Need a brand that holds together?', 'Tell me about the brand, the audience and a rough budget. I usually reply within 24 hours.']
    },
    '/services/web-design': {
      title: 'Web <em>Development</em>',
      lead: 'Sites and products built to be used, not just looked at. I design the structure and interface, then build it in HTML, CSS and JavaScript or hand clean components to your developers.',
      run: ['Structure', 'Interface', 'Motion', 'Build & handover'],
      texts: [
        'A clear structure so people reach what they came for. The portfolio site I built for myself is a working example: gallery, case studies, testimonials and a simple contact route.',
        'Responsive layouts and reusable components, designed with the build in mind. I use Figma for design and React, Next.js or plain HTML for the prototype.',
        'Small, purposeful transitions: scrolling, reveals and state changes built with GSAP and CSS, never motion that gets in the way.',
        'I build in HTML, CSS, JavaScript, TypeScript and Tailwind, and hand over readable files and notes so your team can carry the site on.'
      ],
      cases: [
        ['Web <em>Development</em>', 'Budgeter app', 'React Native • Expo', '/work/apps', '/media/categories/apps/01-budgeter-app.svg'],
        ['Web <em>Development</em>', 'Tendo app', 'Habit tracker • v1.0.0', '/work/apps', '/media/categories/apps/02-tendo-app.svg'],
        ['Web <em>Development</em>', 'Portfolio website', 'HTML • CSS • JavaScript', '/work', '/media/categories/mockups-print.webp'],
        ['Web <em>Development</em>', 'Apps gallery', 'Product screens', '/work/apps', '/media/categories/apps.svg']
      ],
      steps: [
        ['Brief', 'A short call and a written brief: who visits, what they should do next and what must not break.'],
        ['Prototype', 'The key pages go into a clickable prototype early, motion included, so we judge the real thing, not a picture of it.'],
        ['Build together', 'I work with the developers from day one: reviews, handover and the details checked in the browser.'],
        ['Hand over', 'A site your team can edit, with the components and notes on how they fit together.']
      ],
      faq: [
        ['How long does a website take?', 'It depends on the number of pages and how much motion they carry. After the brief I propose stages and dates, and we agree on them before work starts.'],
        ['How do you price a website?', 'There is no price list. I quote after the brief, for the scope we agree on. A rough budget range in the form helps me suggest the right scope.'],
        ['Do you build it or only design it?', 'Both. I build in HTML, CSS and JavaScript and prototype in React or Next.js. For Framer or Webflow builds I work with partner developers.'],
        ['Can you work with our developers?', 'Yes. I design with the build in mind, hand over components and review the site in the browser.'],
        ['Do you work remotely?', 'Yes. I’m based in Nairobi, Kenya, and work with teams remotely through calls, shared Figma files and your channels.']
      ],
      cta: ['Need a site that works?', 'Tell me what the site has to do and a rough budget. I usually reply within 24 hours.']
    },
    '/services/design-for-agencies': {
      title: 'Graphic <em>Design</em>',
      lead: 'Posters, album art, promos and print that hold their own in a feed and in your hands. Bold type, layered visuals and a clear idea, made for music, fashion, brands and events.',
      run: ['Posters', 'Album art', 'Print & mockups', 'Social promos'],
      texts: [
        'Film tributes, music posters and personal work, from Damaged Goods to MF DOOM, Kobe and The Substance. Built as a series, not one-off files.',
        'Covers for Spinx, Vasco, Yujoh and CKAY concepts, designed to read at thumbnail size and still reward a closer look.',
        'Business cards, certificates, signage, embroidery and caps: Q Lounge, Infinity Wellness Consultants, CMM and Oops Fix.',
        'Short-form graphics for feeds and stories: event promos for Generation Now, quote cards and campaign sets.'
      ],
      cases: [
        ['Graphic <em>Design</em>', 'Poster Art', 'Poster series', '/work/posters', '/media/categories/posters.webp'],
        ['Graphic <em>Design</em>', 'Album Covers', 'Cover art', '/work/cover-albums', '/media/categories/cover-albums.webp'],
        ['Graphic <em>Design</em>', 'Q Lounge', 'Identity & signage', '/work/q-lounge', '/media/categories/mockups-print.webp'],
        ['Graphic <em>Design</em>', 'duo++', 'Apparel graphics', '/work/logos', '/media/categories/logos/13-duo.webp']
      ],
      steps: [
        ['Brief', 'A chat on WhatsApp or email with references, goals and a deadline, plus a free 15-minute call if useful.'],
        ['Concepts', '2–3 directions in 2–4 days. Poster, logo or key layout first so the direction is easy to judge.'],
        ['Refine', 'Structured revisions with mockups and real-world tests, on screen and in print.'],
        ['Deliver', 'Final PNG/JPG/PDF plus source files (AI/PSD/Figma/Blend) and support after delivery.']
      ],
      faq: [
        ['How long does design work take?', 'Posters take 1–3 days, logos 3–7 days and a full identity 1–3 weeks. Rush work is possible when the brief is clear.'],
        ['How do you price a project?', 'I take a 50% deposit via M-Pesa and the balance on delivery. The quote follows the brief, so scope and price are agreed up front.'],
        ['What files do I get?', 'Final PNG/JPG/PDF exports and editable source: AI, PSD, Figma or Blend, plus a short guidelines note when it is useful.'],
        ['Do you take 3D or motion work?', 'Yes. Blender work, 3D stills, motion graphics and edit support sit alongside the graphic design work.'],
        ['Do you work remotely?', 'Yes. I’m in Nairobi and work worldwide over WhatsApp, Discord and email. I usually reply within 24 hours.']
      ],
      cta: ['Need something designed?', 'Tell me the format, the deadline and a rough budget. I usually reply within 24 hours.']
    }
  };

  var LEGAL = {
    '/privacy': {
      lede: 'How I handle your personal data on this site: what I collect, why, how long I keep it, and your rights under Kenyan law.',
      toc: ['Who I am', 'What I collect & why', 'Who sees it', 'Cookies', 'Transfers', 'How long I keep it', 'Your rights', 'Changes'],
      sections: {
        's-01': ['Who I am', [
          'I’m Calvin Kamara, a graphic designer and game developer trading as stasher studio in Nairobi, Kenya. For this site I am the data controller under Kenya’s Data Protection Act 2019.',
          'For anything about your data, write to calvinkamarack@gmail.com. I answer privacy questions within 14 days, usually much sooner.'
        ], []],
        's-02': ['What I collect & why', [
          'I collect as little as I can. Most visitors give me nothing but the technical data every website receives. I do not sell personal data, run targeted advertising or make automated decisions about you.'
        ], [
          'Contact form and email: your name, email, company (optional) and project brief. I use them to reply and prepare a quote. Lawful basis: steps taken at your request and my legitimate interest in answering enquiries.',
          'Analytics, only after you consent: Google Analytics 4 reports pages, time on site, device type and approximate location. You can withdraw consent at any time in the cookie settings.',
          'Server and security logs: IP address, browser and request time, processed by my host and spam-check provider to keep the site secure. Lawful basis: legitimate interest.'
        ]],
        's-03': ['Who sees it', [
          'I do not sell your data. A few providers process it on my behalf, under their own data protection commitments: Vercel (hosting and security), Resend (email delivery), Google Ireland (analytics, only with your consent), Adobe Fonts and Spotify (assets loaded in your browser).'
        ], []],
        's-04': ['Cookies', [
          'This site sets one first-party cookie to remember your cookie choice, and analytics cookies only after you consent. The full list is on the cookie policy page. Loading the fonts and music-cover images also tells those providers your IP address and browser details.'
        ], []],
        's-05': ['Transfers', [
          'Some of these providers are based outside Kenya. Where personal data leaves the country, I rely on contractual safeguards and the providers’ published data protection commitments, and keep the transfer limited to what the service needs.'
        ], []],
        's-06': ['How long I keep it', [
          'Contact messages: up to 3 years after our last exchange, or until you ask me to delete them. Contract and tax records: as long as Kenyan tax and accounting law requires. Analytics data: 14 months. Server logs: up to 30 days.'
        ], []],
        's-07': ['Your rights', [
          'Under the Data Protection Act 2019 you may ask what personal data I hold, request a copy, correction or deletion, object to or restrict processing, and withdraw consent. Write to calvinkamarack@gmail.com.',
          'If you are not happy with how I handle your data, you may complain to the Office of the Data Protection Commissioner (ODPC) in Kenya.'
        ], []],
        's-08': ['Changes', [
          'I update this policy when the site changes. The current version and its date are always shown at the top of this page.'
        ], []]
      }
    },
    '/cookies': {
      lede: 'This site uses one cookie to remember your choice, and analytics cookies only if you agree. Here is the full list.',
      toc: ['What cookies are', 'Necessary', 'Analytics (optional)', 'Other services', 'Changing your mind'],
      sections: {
        's-01': ['What cookies are', [
          'Cookies are small text files a website stores in your browser. Strictly necessary cookies keep the site working; optional cookies, such as analytics, are set only after you consent.'
        ], []],
        's-02': ['Necessary', [
          'Always on, so you are not asked about cookies on every visit.'
        ], [
          'consent: remembers whether you accepted or declined analytics. First party, kept for 12 months.'
        ]],
        's-03': ['Analytics (optional)', [
          'Set only after you accept analytics. They help me see which pages people read and where the site could be better. I do not use them for advertising or cross-site tracking.'
        ], [
          '_ga: Google Analytics 4, tells visits apart. First party, kept for 13 months.',
          '_ga_<ID>: Google Analytics 4, keeps the state of a session. First party, kept for 13 months.'
        ]],
        's-04': ['Other services', [
          'The spam check on the contact form (Vercel), the typefaces (Adobe Fonts) and the music-cover images (Spotify) load from their own servers. They receive your IP address and browser details when they load, but set no cookies through this site. The privacy policy says more.'
        ], []],
        's-05': ['Changing your mind', [
          'You can change your choice at any time with the button below or the “Cookie settings” link in the footer. Declining removes the analytics cookies this site has set. You can also block or delete cookies in your browser settings.'
        ], []]
      }
    },
    '/terms': {
      lede: 'The rules for using this website and its contact form. Short, because the site is short: you read, and if you like, you write to me.',
      toc: ['The provider', 'The services', 'What you need', 'Risks', 'Fair use', 'Content and rights', 'Complaints', 'Final provisions'],
      sections: {
        's-01': ['The provider', [
          'This website and its services are provided by Calvin Kamara, trading as stasher studio, Nairobi, Kenya. Contact: calvinkamarack@gmail.com.'
        ], []],
        's-02': ['The services', [
          'Free of charge, the site lets you read its content (projects and notes) and send a message through the contact form. Sending a message does not create a contract; it starts a conversation about a possible project.',
          'Browsing ends when you leave the page. You can stop using either service at any time.'
        ], []],
        's-03': ['What you need', [
          'A device with internet access and an up-to-date browser with JavaScript enabled (the form’s spam check needs it). An email address, if you want an answer.'
        ], []],
        's-04': ['Risks', [
          'Using the internet carries general risks such as malware, phishing and unauthorised access to your device or data. This site is served over HTTPS and the form uses a spam check. Keep your browser up to date and be careful with links and attachments from people you do not know.'
        ], []],
        's-05': ['Fair use', [
          'Please do not send unlawful, abusive or offensive content, spam, or anything meant to disrupt the site. Messages like that may be deleted without a reply.'
        ], []],
        's-06': ['Content and rights', [
          'The site’s texts, designs and images are protected by copyright. They belong to me or to the clients and authors credited with them. You may share links to pages; please ask before reusing the work.'
        ], []],
        's-07': ['Complaints', [
          'If something on the site does not work as it should, write to calvinkamarack@gmail.com with a short description. I reply within 14 days.'
        ], []],
        's-08': ['Final provisions', [
          'The laws of Kenya apply, including the Consumer Protection Act 2019 and the Electronic Transactions Act. If you are a consumer, the mandatory protections of your country of residence still apply.',
          'These terms may change with the site; the current version is always here, with its date at the top. Your personal data is covered by the privacy policy.'
        ], []]
      }
    }
  };

  function applyServices(path) {
    var cfg = SERVICES[path];
    if (!cfg || !document.querySelector('.sv-page')) return;
    var title = document.querySelector('.sv-title');
    if (title) title.innerHTML = cfg.title;
    set(document.querySelector('.sv-lead'), cfg.lead);
    rows('.ab-sv__run .ab-sv__n', cfg.run);
    var texts = [].slice.call(document.querySelectorAll('.ab-sv__texts li'));
    texts.forEach(function (li, i) {
      set(li.querySelector('h3'), cfg.run[i]);
      set(li.querySelector('p'), cfg.texts[i]);
    });
    var list = document.querySelector('.sv-cases');
    if (list) {
      while (list.children.length < cfg.cases.length && list.firstElementChild) {
        list.appendChild(list.firstElementChild.cloneNode(true));
      }
      [].slice.call(list.children).forEach(function (li, i) {
        var c = cfg.cases[i];
        if (!c) return;
        set(li.querySelector('.sv-case__title'), c[1]);
        set(li.querySelector('.sv-case__kind'), c[2]);
        var a = li.querySelector('a.sv-case__card');
        if (a) a.setAttribute('href', c[3]);
        var img = li.querySelector('.sv-case__img');
        if (img) { img.setAttribute('src', c[4]); img.style.objectFit = 'cover'; }
        var vid = li.querySelector('video');
        if (vid) vid.remove();
      });
      list.setAttribute('data-n', String(Math.min(cfg.cases.length, list.children.length)));
    }
    var steps = [].slice.call(document.querySelectorAll('.ab-steps .ab-step'));
    steps.forEach(function (li, i) {
      if (!cfg.steps[i]) return;
      set(li.querySelector('.ab-step__name'), cfg.steps[i][0]);
      set(li.querySelector('.ab-step__text'), cfg.steps[i][1]);
    });
    var faqs = [].slice.call(document.querySelectorAll('.sv-faq__row'));
    faqs.forEach(function (row, i) {
      if (!cfg.faq[i]) return;
      set(row.querySelector('.sv-faq__q'), cfg.faq[i][0]);
      set(row.querySelector('.sv-faq__a'), cfg.faq[i][1]);
    });
    set(document.querySelector('.ab-cta__title'), cfg.cta[0]);
    set(document.querySelector('.ab-cta__text'), cfg.cta[1]);
    document.title = cfg.title.replace(/<[^>]+>/g, '') + ' | stasher studio';
  }

  function applyLegal(path) {
    var cfg = LEGAL[path];
    if (!cfg || !document.querySelector('.dc-page')) return;
    set(document.querySelector('.dc-lede'), cfg.lede);
    rows('.dc-toc__list li a', cfg.toc);
    Object.keys(cfg.sections).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec) return;
      var data = cfg.sections[id];
      set(sec.querySelector('.dc-h'), data[0]);
      var ps = [].slice.call(sec.querySelectorAll('.dc-p'));
      ps.forEach(function (p, i) { if (data[1][i] !== undefined) set(p, data[1][i]); });
      var lis = [].slice.call(sec.querySelectorAll('.dc-rows li'));
      lis.forEach(function (li, i) { if (data[2][i] !== undefined) set(li, data[2][i]); });
    });
  }

  /* Latest-work cards fit whatever image they are given, in any orientation. */
  function fitCards() {
    [].slice.call(document.querySelectorAll('.proj.cat-card')).forEach(function (card) {
      var img = card.querySelector('img.proj__img');
      if (!img) return;
      var w = parseInt(img.getAttribute('width'), 10);
      var h = parseInt(img.getAttribute('height'), 10);
      if (w && h) {
        card.style.aspectRatio = w + ' / ' + h;
        card.style.setProperty('--card-ratio', w + '/' + h);
      }
      img.style.objectFit = 'contain';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.padding = '0';
    });
  }

  /* The work page uses the home page's line-reveal text animation. */
  function animateLines() {
    [].slice.call(document.querySelectorAll('.pp-lmask')).forEach(function (mask, i) {
      mask.querySelectorAll('.pp-ln').forEach(function (line, j) {
        line.style.setProperty('--i', String((i * 3 + j) % 8));
      });
    });
  }

  /* React can re-add the original (empty) CSS links while hydrating. Keep removing
     them so the only stylesheet is site.css, which was in <head> from the first byte. */
  function stripLinks() {
    [].slice.call(document.querySelectorAll('link[rel="stylesheet"]')).forEach(function (l) {
      var h = l.getAttribute('href') || '';
      if (h.indexOf('/assets/static/immutable/chunks/') === 0 || h.indexOf('use.typekit.net') !== -1) l.remove();
      else if (h.indexOf('/assets/portfolio/overrides.css') !== -1) l.setAttribute('href', '/assets/portfolio/site.css');
    });
  }

  /* Certifications list: only the three school qualifications, in order. */
  function applyCertifications() {
    var list = document.querySelector('.ab-ce__list');
    if (!list) return;
    /* Newest first, oldest last: KCPE sits at the bottom. */
    var data = [
      ['Certificate in Graphic Design', 'Shang Tao', '2025'],
      ['KCSE certificate', 'Upperhill School', '2024'],
      ['KCPE certificate', 'Total Care Academy', '2020']
    ];
    while (list.children.length < data.length && list.firstElementChild) {
      list.appendChild(list.firstElementChild.cloneNode(true));
    }
    [].slice.call(list.children).forEach(function (li, i) {
      if (!data[i]) { li.remove(); return; }
      set(li.querySelector('.ab-ce__u'), data[i][0]);
      set(li.querySelector('.ab-ce__by'), data[i][1]);
      var t = li.querySelector('time');
      if (t) { t.textContent = data[i][2]; t.setAttribute('datetime', data[i][2] + '-01-01'); }
      var a = li.querySelector('a');
      if (a) {
        a.removeAttribute('href');
        a.removeAttribute('target');
        a.removeAttribute('rel');
        a.setAttribute('tabindex', '-1');
        a.style.cursor = 'default';
      }
    });
  }

  /* Images render faster: lazy-load everything below the fold, decode off the main
     thread, and prioritise the one above-the-fold image. */
  function optimizeImages() {
    [].slice.call(document.querySelectorAll('img')).forEach(function (img) {
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
      if (!img.hasAttribute('loading')) {
        var r = img.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.9) img.setAttribute('loading', 'lazy');
        else img.setAttribute('fetchpriority', 'high');
      }
    });
  }

  /* About-page style blur/reveal on Contact and Work, plus the Latest Work slider. */
  var animationObserver = null;
  function applyPageAnimations() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    var targets = [];
    if (path === '/contact') {
      targets = ['.dc-title', '.dc-intro .dc-lede', '.dc-sec .dc-h', '.dc-sec .dc-p',
        '.dc-toc__label', '.dc-meta', '.ct-lead', '.ct-body > div', '.ct-form fieldset',
        '.f-foot__col > *'];
    } else if (path === '/work' || path.indexOf('/work/') === 0) {
      targets = ['.ew-title', '.ew-lede', '.ew-back', '.ew-grid .ew-item',
        '.cat-gallery__item', '.cat-gallery__item figcaption', '.f-foot__col > *'];
    } else if (path === '/' || path === '/index.html') {
      targets = ['.proj.cat-card'];
    }
    if (!targets.length) return;
    var els = [];
    targets.forEach(function (sel) {
      [].slice.call(document.querySelectorAll(sel)).forEach(function (el) { els.push(el); });
    });
    els.forEach(function (el, i) {
      if (el.classList.contains('an-blur') || el.classList.contains('an-slide')) return;
      el.style.setProperty('--an-delay', String(Math.min(i % 8, 7) * 70) + 'ms');
      el.classList.add(path === '/' || path === '/index.html' ? 'an-slide' : 'an-blur');
    });
    if (!animationObserver) {
      animationObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.animationPlayState = 'running';
          [].slice.call(entry.target.querySelectorAll('.proj__img, .proj__cap')).forEach(function (child) {
            child.style.animationPlayState = 'running';
          });
          animationObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    }
    els.forEach(function (el) { animationObserver.observe(el); });
    if (path === '/' || path === '/index.html') {
      var runSlider = function () {
        [].slice.call(document.querySelectorAll('.an-slide')).forEach(function (card) {
          var r = card.getBoundingClientRect();
          if (r.top > window.innerHeight * 1.8 || r.bottom < -100) return;
          card.style.animationPlayState = 'running';
          [].slice.call(card.querySelectorAll('.proj__img, .proj__cap')).forEach(function (child) {
            child.style.animationPlayState = 'running';
          });
        });
      };
      if (!window.__sliderScrollBound) {
        window.__sliderScrollBound = true;
        window.addEventListener('scroll', runSlider, { passive: true });
        setInterval(runSlider, 250);
      }
      runSlider();
    }
  }

  function applyExtra() {
    stripLinks();
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    try { applyServices(path); } catch (e) {}
    try { applyLegal(path); } catch (e) {}
    try { applyCertifications(); } catch (e) {}
    try { fitCards(); } catch (e) {}
    try { animateLines(); } catch (e) {}
    try { applyPageAnimations(); } catch (e) {}
    try { optimizeImages(); } catch (e) {}
  }
  window.__stasherExtra = applyExtra;

  [2200, 3200, 4500].forEach(function (t) { setTimeout(applyExtra, t); });
  new MutationObserver(stripLinks).observe(document.head, { childList: true });

  /* Seamless navigation between pages: fetch first, then swap without a blank frame. */
  (function () {
    if (window.__globalNavBound) return;
    window.__globalNavBound = true;
    function clean(raw) {
      return (raw || '').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    }
    function isInternal(a) {
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) !== '/') return false;
      return clean(href) !== clean(location.pathname);
    }
    function swap(doc, url, push) {
      var main = document.querySelector('main');
      var next = doc.querySelector('main');
      if (!main || !next) { location.href = url; return; }
      [].slice.call(document.querySelectorAll('[data-liquid-head],.sv-title,.ab-title2,.dc-title,.work__heading,.f-title,.sv-lead,.pp-lmask'))
        .forEach(function (h) { try { h.style.fontSize = getComputedStyle(h).fontSize; } catch (e) {} });
      var oldRoot = document.querySelector('body > div[class*="-page"]');
      var newRoot = doc.querySelector('body > div[class*="-page"]');
      if (oldRoot && newRoot) oldRoot.className = newRoot.className;
      main.className = next.className || '';
      main.innerHTML = next.innerHTML;
      document.title = doc.title;
      var nd = doc.querySelector('meta[name="description"]');
      var cd = document.querySelector('meta[name="description"]');
      if (nd && cd) cd.setAttribute('content', nd.getAttribute('content') || '');
      if (push) history.pushState({ stasherNav: true }, '', url);
      main.__workCategoriesDone = false;
      window.__stasherSoftRendering = true;
      if (window.__stasherApplyAgain) window.__stasherApplyAgain();
      applyExtra();
      window.__stasherSoftRendering = false;
      document.documentElement.classList.remove('work-pending');
      try { main.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' }); } catch (e) {}
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { window.dispatchEvent(new Event('resize')); });
    }
    function go(url, push) {
      fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        if (!doc.querySelector('main')) { location.href = url; return; }
        swap(doc, url, push);
      }).catch(function () { location.href = url; });
    }
    window.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!isInternal(a)) return;
      e.preventDefault();
      e.stopPropagation();
      go(clean(a.getAttribute('href')), true);
    }, true);
    window.addEventListener('popstate', function () {
      var p = clean(location.pathname);
      if (window.__workNavBound && (p === '/work' || p.indexOf('/work/') === 0)) return;
      go(p, false);
    });
  })();
})();
