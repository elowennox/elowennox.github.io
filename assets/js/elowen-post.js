/* ELOWEN post: accessible heading index and approximate reading time. */
(function () {
  const content = document.getElementById('post-content');
  const toc = document.getElementById('post-toc');
  if (!content || !toc) return;
  const headings = Array.from(content.querySelectorAll('h2,h3'));
  const used = new Set();
  headings.forEach((heading, index) => {
    let id = heading.id || 'section-' + (index + 1);
    while (used.has(id)) id += '-2';
    used.add(id);
    heading.id = id;
  });
  toc.textContent = '';
  if (headings.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'aside-empty';
    msg.textContent = '이 글에는 목차가 없습니다.';
    toc.appendChild(msg);
  } else {
    headings.forEach((heading) => {
      const link = document.createElement('a');
      link.href = '#' + encodeURIComponent(heading.id);
      link.textContent = heading.textContent.trim();
      if (heading.tagName === 'H3') link.classList.add('level-3');
      toc.appendChild(link);
    });
    if ('IntersectionObserver' in window) {
      const links = Array.from(toc.querySelectorAll('a'));
      const observer = new IntersectionObserver((entries) => {
        const showing = entries.filter(x => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!showing.length) return;
        links.forEach(link => link.classList.toggle('active', decodeURIComponent(link.hash.slice(1)) === showing[0].target.id));
      }, {rootMargin:'-10% 0px -72% 0px'});
      headings.forEach(h => observer.observe(h));
    }
  }
  const readTime = document.getElementById('read-time');
  if (readTime) {
    const chars = (content.innerText || '').replace(/\s/g, '').length;
    readTime.textContent = '약 ' + Math.max(1, Math.ceil(chars / 450)) + '분';
  }
})();
