// OmniCraft AI — Main Reactive Logic Engine (100% Matching User HTML)

document.addEventListener('DOMContentLoaded', () => {
  // Toast Function
  const toast = document.getElementById('toast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
  }

  // 1. TOOL NAVIGATION SWITCHER
  const navTabs = document.querySelectorAll('.nav-tab');
  const toolPanels = document.querySelectorAll('.tool-panel');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      toolPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tool');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Footer Navigation Links
  const footerLinks = document.querySelectorAll('.footer-links a');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').replace('#', '');
      navTabs.forEach(t => t.classList.remove('active'));
      toolPanels.forEach(p => p.classList.remove('active'));

      const activeTab = document.querySelector(`.nav-tab[data-tool="${targetId}"]`);
      if (activeTab) activeTab.classList.add('active');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 2. THEME SELECTOR
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    const savedTheme = localStorage.getItem('omnicraft_theme') || 'violet';
    themeSelect.value = savedTheme;
    if (savedTheme !== 'violet') document.documentElement.setAttribute('data-theme', savedTheme);

    themeSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected === 'violet') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', selected);
      }
      localStorage.setItem('omnicraft_theme', selected);
      showToast(`Switched theme to ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // 3. DONATE MODAL HANDLERS
  const donateModal = document.getElementById('donate-modal');
  const btnOpenDonate = document.getElementById('btn-open-donate');
  const btnSidebarDonate = document.getElementById('btn-sidebar-donate');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCopyUpi = document.getElementById('btn-copy-upi');
  const upiIdText = document.getElementById('upi-id-text');

  function openDonateModal() { donateModal?.classList.remove('hidden'); }
  function closeDonateModal() { donateModal?.classList.add('hidden'); }

  btnOpenDonate?.addEventListener('click', openDonateModal);
  btnSidebarDonate?.addEventListener('click', openDonateModal);
  btnCloseModal?.addEventListener('click', closeDonateModal);

  btnCopyUpi?.addEventListener('click', () => {
    if (upiIdText) {
      navigator.clipboard.writeText(upiIdText.textContent);
      showToast('UPI ID copied to clipboard!');
    }
  });

  // 4. TOOL 1: AI TEXT SUMMARIZER
  const sumInputText = document.getElementById('sum-input-text');
  const sumToneSelect = document.getElementById('sum-tone');
  const sumLengthSelect = document.getElementById('sum-length');
  const btnGenerateSum = document.getElementById('btn-generate-sum');
  const sumOutputBox = document.getElementById('sum-output-box');
  const btnCopySum = document.getElementById('btn-copy-sum');
  const btnSampleArticle = document.getElementById('btn-sample-article');
  const btnClearSum = document.getElementById('btn-clear-sum');

  const metricWords = document.getElementById('metric-words');
  const metricTime = document.getElementById('metric-time');
  const metricSentiment = document.getElementById('metric-sentiment');

  const SAMPLE_ARTICLE = `Artificial intelligence is rapidly transforming software development, business workflows, and creator productivity. Modern developers leverage AI pair-programming tools to build full-stack web applications, write unit tests, and refactor legacy codebases at unprecedented speeds. By automating repetitive boilerplate code and standardizing design systems, small teams can now launch production-ready products in hours rather than months. As client-side browser performance improves, web applications run fully inside the browser without needing heavy backend infrastructure, ensuring total user privacy and instant responsiveness.`;

  btnSampleArticle?.addEventListener('click', () => {
    if (sumInputText) {
      sumInputText.value = SAMPLE_ARTICLE;
      updateInputMetrics();
    }
  });

  btnClearSum?.addEventListener('click', () => {
    if (sumInputText) {
      sumInputText.value = '';
      updateInputMetrics();
      if (sumOutputBox) {
        sumOutputBox.innerHTML = `<p class="placeholder-text">Your summary bullet points will appear here after clicking 'Generate Summary'...</p>`;
      }
    }
  });

  function updateInputMetrics() {
    if (!sumInputText) return;
    const text = sumInputText.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const readingTimeMins = (words / 200).toFixed(1);
    
    if (metricWords) metricWords.textContent = words;
    if (metricTime) metricTime.textContent = `${readingTimeMins} mins`;

    if (metricSentiment) {
      if (text.toLowerCase().includes('great') || text.toLowerCase().includes('transforming') || text.toLowerCase().includes('improves')) {
        metricSentiment.textContent = 'Positive 🚀';
        metricSentiment.style.color = '#34d399';
      } else if (text.toLowerCase().includes('fail') || text.toLowerCase().includes('error') || text.toLowerCase().includes('slow')) {
        metricSentiment.textContent = 'Negative ⚠️';
        metricSentiment.style.color = '#f87171';
      } else {
        metricSentiment.textContent = 'Neutral';
        metricSentiment.style.color = '#38bdf8';
      }
    }
  }

  sumInputText?.addEventListener('input', updateInputMetrics);

  btnGenerateSum?.addEventListener('click', () => {
    const text = sumInputText?.value.trim();
    if (!text) {
      showToast('Please enter or paste text to summarize!');
      return;
    }

    if (btnGenerateSum) {
      btnGenerateSum.innerHTML = `⚡ Summarizing...`;
      btnGenerateSum.disabled = true;
    }

    setTimeout(() => {
      const tone = sumToneSelect?.value || 'concise';
      const length = sumLengthSelect?.value || 'medium';

      const rawChunks = text
        .split(/[\r\n.]+|\?|\!/)
        .map(s => s.trim())
        .filter(s => s.length > 10);

      if (rawChunks.length === 0) rawChunks.push(text.slice(0, 200));

      let targetCount = length === 'short' ? 3 : length === 'medium' ? 5 : 8;
      const countToUse = Math.min(rawChunks.length, targetCount);

      let bullets = [];
      for (let i = 0; i < countToUse; i++) {
        bullets.push(`<li><strong>Point ${i + 1}:</strong> ${rawChunks[i]}</li>`);
      }

      if (sumOutputBox) {
        sumOutputBox.innerHTML = `<ul>${bullets.join('')}</ul>`;
      }

      if (btnGenerateSum) {
        btnGenerateSum.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          Generate Summary
        `;
        btnGenerateSum.disabled = false;
      }
      showToast(`Generated summary with ${countToUse} key topics!`);
    }, 400);
  });

  btnCopySum?.addEventListener('click', () => {
    if (sumOutputBox && !sumOutputBox.innerText.includes('Your summary bullet points')) {
      navigator.clipboard.writeText(sumOutputBox.innerText);
      showToast('Summary copied to clipboard!');
    } else {
      showToast('Generate a summary first!');
    }
  });

  // 5. TOOL 2: BROWSER-NATIVE IMAGE COMPRESSOR
  const imageDropZone = document.getElementById('image-drop-zone');
  const imageFileInput = document.getElementById('image-file-input');
  const compressControls = document.getElementById('compress-controls');

  const imgOriginalPreview = document.getElementById('img-original-preview');
  const imgCompressedPreview = document.getElementById('img-compressed-preview');
  const origSizeLabel = document.getElementById('orig-size-label');
  const compSizeLabel = document.getElementById('comp-size-label');
  const savedPercentLabel = document.getElementById('saved-percent-label');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityValLabel = document.getElementById('quality-val-label');
  const targetFormat = document.getElementById('target-format');
  const btnDownloadImg = document.getElementById('btn-download-img');

  let currentLoadedFile = null;

  imageDropZone?.addEventListener('click', () => imageFileInput?.click());

  imageDropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageDropZone.style.borderColor = '#a855f7';
  });

  imageDropZone?.addEventListener('dragleave', () => {
    imageDropZone.style.borderColor = 'rgba(168, 85, 247, 0.4)';
  });

  imageDropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    imageDropZone.style.borderColor = 'rgba(168, 85, 247, 0.4)';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageCompress(e.dataTransfer.files[0]);
    }
  });

  imageFileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageCompress(e.target.files[0]);
    }
  });

  qualitySlider?.addEventListener('input', (e) => {
    if (qualityValLabel) qualityValLabel.textContent = `${e.target.value}%`;
    if (currentLoadedFile) handleImageCompress(currentLoadedFile);
  });

  targetFormat?.addEventListener('change', () => {
    if (currentLoadedFile) handleImageCompress(currentLoadedFile);
  });

  function handleImageCompress(file) {
    currentLoadedFile = file;
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        if (imgOriginalPreview) imgOriginalPreview.src = img.src;
        if (origSizeLabel) origSizeLabel.textContent = `${(file.size / 1024).toFixed(1)} KB`;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const quality = (qualitySlider ? parseInt(qualitySlider.value) : 80) / 100;
        const format = targetFormat ? targetFormat.value : 'image/webp';

        const compressedDataUrl = canvas.toDataURL(format, quality);
        if (imgCompressedPreview) imgCompressedPreview.src = compressedDataUrl;

        const head = `data:${format};base64,`;
        const sizeBytes = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
        const reductionPercent = Math.max(0, Math.round((1 - (sizeBytes / file.size)) * 100));

        if (compSizeLabel) compSizeLabel.textContent = `${(sizeBytes / 1024).toFixed(1)} KB`;
        if (savedPercentLabel) savedPercentLabel.textContent = `${reductionPercent}%`;

        if (btnDownloadImg) {
          btnDownloadImg.onclick = () => {
            const a = document.createElement('a');
            a.href = compressedDataUrl;
            a.download = `compressed-image.${format.split('/')[1]}`;
            a.click();
          };
        }

        if (compressControls) compressControls.classList.remove('hidden');
        showToast('Image compressed locally!');
      };
    };

    reader.readAsDataURL(file);
  }

  // 6. TOOL 3: AI BIO & PROMPT ENHANCER
  const modeChips = document.querySelectorAll('.mode-chip');
  const bioInput = document.getElementById('bio-input');
  const btnGenerateBio = document.getElementById('btn-generate-bio');
  const bioOutputText = document.getElementById('bio-output-text');
  const btnCopyBio = document.getElementById('btn-copy-bio');

  let activeBioMode = 'linkedin';

  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeBioMode = chip.getAttribute('data-biomode');
    });
  });

  btnGenerateBio?.addEventListener('click', () => {
    const inputVal = bioInput?.value.trim() || 'Software Developer & Creator';

    let output = '';
    if (activeBioMode === 'linkedin') {
      output = `🚀 ${inputVal} | Transforming complex ideas into scalable web solutions. Open to high-impact opportunities!`;
    } else if (activeBioMode === 'twitter') {
      output = `✨ ${inputVal}. Building in public 🛠️ | Let's connect!`;
    } else {
      output = `Act as an expert advisor for: ${inputVal}. Provide a step-by-step breakdown with actionable recommendations, code examples, and key insights.`;
    }

    if (bioOutputText) bioOutputText.value = output;
    showToast('Generated optimized output!');
  });

  btnCopyBio?.addEventListener('click', () => {
    if (bioOutputText && bioOutputText.value) {
      navigator.clipboard.writeText(bioOutputText.value);
      showToast('Copied to clipboard!');
    }
  });

  // 7. TOOL 4: GLASSMORPHISM & SVG WAVE STUDIO
  const glassBlur = document.getElementById('glass-blur');
  const lblGlassBlur = document.getElementById('lbl-glass-blur');
  const glassOpacity = document.getElementById('glass-opacity');
  const lblGlassOpacity = document.getElementById('lbl-glass-opacity');
  const glassBorder = document.getElementById('glass-border');
  const lblGlassBorder = document.getElementById('lbl-glass-border');
  const glassLivePreview = document.getElementById('glass-live-preview');
  const btnCopyGlassCss = document.getElementById('btn-copy-glass-css');

  function updateGlassPreview() {
    const blur = glassBlur ? glassBlur.value : 16;
    const opacity = glassOpacity ? glassOpacity.value : 0.25;
    const border = glassBorder ? glassBorder.value : 0.2;

    if (lblGlassBlur) lblGlassBlur.textContent = `${blur}px`;
    if (lblGlassOpacity) lblGlassOpacity.textContent = opacity;
    if (lblGlassBorder) lblGlassBorder.textContent = border;

    const card = glassLivePreview?.querySelector('.preview-inner-card');
    if (card) {
      card.style.backdropFilter = `blur(${blur}px)`;
      card.style.webkitBackdropFilter = `blur(${blur}px)`;
      card.style.background = `rgba(255, 255, 255, ${opacity})`;
      card.style.borderColor = `rgba(255, 255, 255, ${border})`;
    }
  }

  glassBlur?.addEventListener('input', updateGlassPreview);
  glassOpacity?.addEventListener('input', updateGlassPreview);
  glassBorder?.addEventListener('input', updateGlassPreview);

  btnCopyGlassCss?.addEventListener('click', () => {
    const blur = glassBlur ? glassBlur.value : 16;
    const opacity = glassOpacity ? glassOpacity.value : 0.25;
    const border = glassBorder ? glassBorder.value : 0.2;

    const cssCode = `background: rgba(255, 255, 255, ${opacity});\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\nborder: 1px solid rgba(255, 255, 255, ${border});\nborder-radius: 12px;`;
    navigator.clipboard.writeText(cssCode);
    showToast('Glassmorphism CSS copied to clipboard!');
  });

  // SVG Wave
  const waveHeight = document.getElementById('wave-height');
  const waveColor = document.getElementById('wave-color');
  const btnRandomizeWave = document.getElementById('btn-randomize-wave');
  const btnCopySvg = document.getElementById('btn-copy-svg');
  const liveSvgWave = document.getElementById('live-svg-wave');

  function updateSvgWave() {
    const path = liveSvgWave?.querySelector('path');
    if (path && waveColor) {
      path.setAttribute('fill', waveColor.value);
    }
  }

  waveColor?.addEventListener('input', updateSvgWave);

  btnRandomizeWave?.addEventListener('click', () => {
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    if (waveColor) waveColor.value = randomColor;
    updateSvgWave();
    showToast('Randomized wave color!');
  });

  btnCopySvg?.addEventListener('click', () => {
    if (liveSvgWave) {
      navigator.clipboard.writeText(liveSvgWave.outerHTML);
      showToast('SVG Wave code copied to clipboard!');
    }
  });
});
