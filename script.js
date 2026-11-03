(() => {
  'use strict';
  const $ = (q, root = document) => root.querySelector(q);
  const nav = $('#primary-nav');
  const toggle = $('.menu-toggle');
  const navLinks = [...document.querySelectorAll('.nav-link')];

  function closeMenu() {
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  }
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('menu-open', open);
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (event) => { if (nav?.classList.contains('is-open') && !event.target.closest('.header-inner')) closeMenu(); });

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -32px 0px', threshold: 0.10 })
    : null;
  document.querySelectorAll('.reveal').forEach(el => {
    if (observer) observer.observe(el);
    else el.classList.add('in-view');
  });

  if ('IntersectionObserver' in window) {
    const sections = [...document.querySelectorAll('main section[id]')];
    const sectionWatcher = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) {
        let current = visible[0].target.id;
        if (current === 'avaliacoes') current = 'resultados';
        const target = current;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + target));
      }
    }, { rootMargin: '-25% 0px -55% 0px' });
    sections.forEach(section => sectionWatcher.observe(section));
  }

  const year = $('#year'); if (year) year.textContent = String(new Date().getFullYear());

  const form = $('#quote-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const nome = $('#nome').value.trim().replace(/\s+/g, ' ').slice(0,80);
    const veiculo = $('#veiculo').value.trim().replace(/\s+/g, ' ').slice(0,100);
    const servico = $('#servico').value;
    const observacao = $('#observacao').value.trim().slice(0,500);
    const msg = [
      'Olá, Golden Boys! Gostaria de solicitar um orçamento pelo site.',
      '',
      `Nome: ${nome}`,
      `Veículo: ${veiculo}`,
      `Serviço: ${servico}`,
      ...(observacao ? [`Mensagem: ${observacao}`] : []),
      '',
      'Poderiam me orientar sobre as opções e a disponibilidade?'
    ].join('\n');
    const url = `https://wa.me/5545999284768?text=${encodeURIComponent(msg)}`;
    // Redirecionamento direto, realizado somente após o envio voluntário do formulário.
    window.location.assign(url);
  });
})();
