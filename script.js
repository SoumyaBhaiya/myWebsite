document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.getElementById('hero-title');
  const heroLead = document.getElementById('hero-lead');
  
  if (!heroTitle || !heroLead) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Title text & element setup
  const titleText = (heroTitle.getAttribute('data-text') || heroTitle.textContent).trim();
  heroTitle.innerHTML = '';
  const titleContainer = document.createElement('span');
  titleContainer.className = 'typewriter-text';
  const titleCursor = document.createElement('span');
  titleCursor.className = 'typewriter-cursor';
  titleCursor.setAttribute('aria-hidden', 'true');
  heroTitle.appendChild(titleContainer);
  heroTitle.appendChild(titleCursor);

  // Lead text & element setup
  const leadText = (heroLead.getAttribute('data-text') || heroLead.textContent).trim().replace(/\s+/g, ' ');
  heroLead.innerHTML = '';
  const leadContainer = document.createElement('span');
  leadContainer.className = 'typewriter-text';
  const leadCursor = document.createElement('span');
  leadCursor.className = 'typewriter-cursor';
  leadCursor.setAttribute('aria-hidden', 'true');
  leadCursor.style.display = 'none'; // Hide initially
  heroLead.appendChild(leadContainer);
  heroLead.appendChild(leadCursor);

  // If user prefers reduced motion, bypass typewriter animations
  if (prefersReducedMotion) {
    titleContainer.textContent = titleText;
    titleCursor.style.display = 'none';
    leadContainer.textContent = leadText;
    document.querySelectorAll('.reveal-section').forEach(s => s.classList.add('visible'));
    return;
  }

  // Typewriter animation function
  function typeText(text, container, cursor, delayMultiplier = 1) {
    return new Promise((resolve) => {
      cursor.style.display = 'inline-block';
      let index = 0;

      function type() {
        if (index < text.length) {
          container.textContent += text.charAt(index);
          index++;

          const currentChar = text.charAt(index - 1);
          let delay = (Math.random() * (70 - 25) + 25) * delayMultiplier; // Quick and fluid typing

          // Pause slightly on punctuation
          if (currentChar === ',' || currentChar === ';') {
            delay = 250;
          } else if (currentChar === '.' || currentChar === '!') {
            delay = 450;
          }

          setTimeout(type, delay);
        } else {
          resolve();
        }
      }

      type();
    });
  }

  // Run sequential animation
  setTimeout(async () => {
    // 1. Type the title
    await typeText(titleText, titleContainer, titleCursor, 1.3);
    
    // 2. Hide the title cursor to prevent double-cursor distraction
    titleCursor.style.display = 'none';
    
    // 3. Pause for pacing before typing paragraph
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 4. Type the lead paragraph (slightly faster multiplier for reading flow)
    await typeText(leadText, leadContainer, leadCursor, 0.5);

    // 5. Hide the lead cursor
    leadCursor.style.display = 'none';

    // 6. Reveal sections sequentially after typewriter is finished
    const sections = document.querySelectorAll('.reveal-section');
    for (let i = 0; i < sections.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      sections[i].classList.add('visible');
    }
  }, 400);
});
