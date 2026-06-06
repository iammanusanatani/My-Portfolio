// CURSOR
        const cur = document.getElementById('cursor'), ring = document.getElementById('cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
        (function a() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(a); })();

        // NAVBAR SCROLL
        window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 50));

        // HAMBURGER
        const ham = document.getElementById('ham'), menu = document.getElementById('mobileMenu');
        ham.addEventListener('click', () => { ham.classList.toggle('open'); menu.classList.toggle('open'); document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : ''; });
        function closeMenu() { ham.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = ''; }

        // SMOOTH SCROLL
        document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); closeMenu(); const t = document.querySelector(a.getAttribute('href')); if (t) t.scrollIntoView({ behavior: 'smooth' }); }));

        // PARTICLES
        const cv = document.getElementById('particles-canvas'), ctx = cv.getContext('2d');
        let W, H, pts = [];
        function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; } resize(); window.addEventListener('resize', resize);
        function Pt() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .35; this.vy = (Math.random() - .5) * .35; this.r = Math.random() * 1.2 + .3; this.a = Math.random() * .35 + .08; }
        for (let i = 0; i < 80; i++)pts.push(new Pt());
        (function draw() {
            ctx.clearRect(0, 0, W, H);
            pts.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(14,165,233,${p.a})`; ctx.fill(); });
            for (let i = 0; i < pts.length; i++)for (let j = i + 1; j < pts.length; j++) { const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 100) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(14,165,233,${.06 * (1 - d / 100)})`; ctx.lineWidth = .5; ctx.stroke(); } }
            requestAnimationFrame(draw);
        })();

        // SCROLL REVEAL + SKILL BARS
        const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); e.target.querySelectorAll('.bar-fill').forEach(b => { b.style.transform = `scaleX(${b.dataset.w})`; b.style.transition = 'transform 1.2s cubic-bezier(0.16,1,0.3,1)'; }); } }); }, { threshold: 0.12 });
        document.querySelectorAll('.reveal, .rev-l, .rev-r').forEach(el => obs.observe(el));

        // ACTIVE NAV
        const secs = document.querySelectorAll('section[id]'), navAs = document.querySelectorAll('.nav-links a');
        window.addEventListener('scroll', () => { let cur = ''; secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; }); navAs.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); }); });

        // CONTACT FORM
        async function sendMsg(e) {
            e.preventDefault();
            const name = document.getElementById('f-name').value.trim();
            const email = document.getElementById('f-email').value.trim();
            const subject = document.getElementById('f-subject').value.trim();
            const msg = document.getElementById('f-msg').value.trim();
            const st = document.getElementById('f-status');
            const btn = document.getElementById('sendBtn');
            if (!name || !email || !msg) {
                st.style.display = 'block'; st.style.background = 'rgba(239,68,68,0.15)'; st.style.border = '1px solid rgba(239,68,68,0.4)'; st.style.color = '#f87171';
                st.textContent = '⚠️ Name, Email aur Message required hai!'; return;
            }
            btn.textContent = '⏳ Sending...'; btn.disabled = true;
            try {
                const res = await fetch('https://formspree.io/f/xpqewngb', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ name, email, subject, message: msg }) });
                if (res.ok) {
                    st.style.display = 'block'; st.style.background = 'rgba(6,255,212,0.1)'; st.style.border = '1px solid rgba(6,255,212,0.35)'; st.style.color = '#06ffd4';
                    st.textContent = '✅ Message sent! Manu will reply soon.';
                    ['f-name', 'f-email', 'f-subject', 'f-msg'].forEach(id => document.getElementById(id).value = '');
                    btn.textContent = '✅ Sent!'; setTimeout(() => { btn.textContent = 'Send Message →'; btn.disabled = false; }, 3000);
                } else throw new Error();
            } catch {
                st.style.display = 'block'; st.style.background = 'rgba(239,68,68,0.15)'; st.style.border = '1px solid rgba(239,68,68,0.4)'; st.style.color = '#f87171';
                st.textContent = '❌ Something went wrong. Try again!'; btn.textContent = 'Send Message →'; btn.disabled = false;
            }
        }

        // RESUME DOWNLOAD
        