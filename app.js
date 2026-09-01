// OmniCraft AI — Main Reactive Logic Engine

document.addEventListener('DOMContentLoaded', () => {
  // Global Elements
  const navTabs = document.querySelectorAll('.nav-tab');
  const toolPanels = document.querySelectorAll('.tool-panel');
  const toast = document.getElementById('toast');
  const themeSelect = document.getElementById('theme-select');

  // Load Saved Theme
  const savedTheme = localStorage.getItem('omnicraft_theme') || 'violet';
  if (themeSelect) {
    themeSelect.value = savedTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);

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

  // Modal & Donate Elements
  const donateModal = document.getElementById('donate-modal');
  const btnOpenDonate = document.getElementById('btn-open-donate');
  const btnSidebarDonate = document.getElementById('btn-sidebar-donate');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCopyUpi = document.getElementById('btn-copy-upi');
  const upiIdText = document.getElementById('upi-id-text');

  // Toast Function
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2800);
  }

  // ----------------------------------------------------
  // 1. TOOL NAVIGATION SWITCHER
  // ----------------------------------------------------
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      toolPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tool');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Footer Links Click Switcher
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

  // Modal Handlers
  function openDonateModal() {
    donateModal.classList.remove('hidden');
  }
  function closeDonateModal() {
    donateModal.classList.add('hidden');
  }

  if (btnOpenDonate) btnOpenDonate.addEventListener('click', openDonateModal);
  if (btnSidebarDonate) btnSidebarDonate.addEventListener('click', openDonateModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeDonateModal);

  if (btnCopyUpi) {
    btnCopyUpi.addEventListener('click', () => {
      navigator.clipboard.writeText(upiIdText.textContent);
      showToast('UPI ID copied to clipboard!');
    });
  }

  // ----------------------------------------------------
  // 2. TOOL 1: AI TEXT & DOCUMENT SUMMARIZER
  // ----------------------------------------------------
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

  btnSampleArticle.addEventListener('click', () => {
    sumInputText.value = SAMPLE_ARTICLE;
    updateInputMetrics();
  });

  btnClearSum.addEventListener('click', () => {
    sumInputText.value = '';
    updateInputMetrics();
    sumOutputBox.innerHTML = `<p class="placeholder-text">Your summary bullet points will appear here after clicking 'Generate Summary'...</p>`;
  });

  function updateInputMetrics() {
    const text = sumInputText.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const readingTimeMins = (words / 200).toFixed(1);
    
    metricWords.textContent = words;
    metricTime.textContent = `${readingTimeMins} mins`;

    // Sentiment Detector
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

  sumInputText.addEventListener('input', updateInputMetrics);

  btnGenerateSum.addEventListener('click', () => {
    const text = sumInputText.value.trim();
    if (!text) {
      showToast('Please enter or paste text to summarize!');
      return;
    }

    btnGenerateSum.innerHTML = `⚡ Summarizing...`;
    btnGenerateSum.disabled = true;

    setTimeout(() => {
      const tone = sumToneSelect.value;
      const length = sumLengthSelect.value;

      // Smart Text Parser: Handles sentences AND line-by-line web text lists
      const rawChunks = text
        .split(/[\r\n.]+|\?|\!/)
        .map(s => s.trim())
        .filter(s => {
          if (s.length < 10) return false;
          // Filter out web navigation headers (e.g., "Homepage", "Accessibility links", "Search BBC", etc.)
          if (/^(homepage|accessibility|skip to content|sign in|home|news|sport|business|technology|health|culture|more menu|search|learning english|copyright|privacy policy|terms of use|about the bbc|contact|courses|facebook|instagram|youtube|tiktok)/i.test(s)) return false;
          return true;
        });

      if (rawChunks.length === 0) {
        rawChunks.push(text.slice(0, 200));
      }

      let targetCount = 4;
      if (length === 'medium') targetCount = 7;
      if (length === 'detailed') targetCount = 12;

      const countToUse = Math.min(rawChunks.length, targetCount);
      let outputHtml = '';

      if (tone === 'concise') {
        const bullets = [];
        for (let i = 0; i < countToUse; i++) {
          const sent = rawChunks[i];
          const prefix = i === 0 ? 'Core Insight' : i === 1 ? 'Key Topic' : i === countToUse - 1 ? 'Conclusion' : `Point ${i + 1}`;
          bullets.push(`<li><strong>${prefix}:</strong> ${sent}</li>`);
        }
        outputHtml = `<ul>${bullets.join('')}</ul>`;
      } else if (tone === 'executive') {
        const bullets = [];
        for (let i = 0; i < countToUse; i++) {
          bullets.push(`<li><strong>Executive Area ${i + 1}:</strong> ${rawChunks[i]}</li>`);
        }
        outputHtml = `<h4>Executive Brief (${countToUse} Key Topics Analyzed):</h4><br><ul>${bullets.join('')}</ul>`;
      } else if (tone === 'simple') {
        const bullets = [];
        for (let i = 0; i < countToUse; i++) {
          bullets.push(`<li>💡 ${rawChunks[i]}</li>`);
        }
        outputHtml = `<p><strong>Simple Breakdown (${countToUse} Main Takeaways):</strong></p><br><ul>${bullets.join('')}</ul>`;
      } else {
        const bullets = [];
        for (let i = 0; i < countToUse; i++) {
          bullets.push(`<li><strong>Action / Topic ${i + 1}:</strong> ${rawChunks[i]}</li>`);
        }
        outputHtml = `<ol>${bullets.join('')}</ol>`;
      }

      sumOutputBox.innerHTML = outputHtml;
      btnGenerateSum.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        Generate Summary
      `;
      btnGenerateSum.disabled = false;
      showToast(`Extracted ${countToUse} key topics successfully!`);
    }, 400);
  });

  btnCopySum.addEventListener('click', () => {
    if (sumOutputBox.innerText.includes('Your summary bullet points')) {
      showToast('Generate a summary first!');
      return;
    }
    navigator.clipboard.writeText(sumOutputBox.innerText);
    showToast('Summary copied to clipboard!');
  });

  // ----------------------------------------------------
  // 3. TOOL 2: BROWSER-NATIVE IMAGE COMPRESSOR
  // ----------------------------------------------------
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
  const targetFormatSelect = document.getElementById('target-format');
  const btnDownloadImg = document.getElementById('btn-download-img');

  let currentLoadedImage = null;
  let compressedBlobUrl = null;
  let originalFileSizeBytes = 0;

  imageDropZone.addEventListener('click', () => imageFileInput.click());

  imageDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageDropZone.style.borderColor = '#6366f1';
  });

  imageDropZone.addEventListener('dragleave', () => {
    imageDropZone.style.borderColor = 'rgba(99, 102, 241, 0.4)';
  });

  imageDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  });

  imageFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file!');
      return;
    }

    originalFileSizeBytes = file.size;
    origSizeLabel.textContent = formatBytes(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        currentLoadedImage = img;
        imgOriginalPreview.src = e.target.result;
        compressControls.classList.remove('hidden');
        processCompression();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  qualitySlider.addEventListener('input', () => {
    qualityValLabel.textContent = `${qualitySlider.value}%`;
    processCompression();
  });

  targetFormatSelect.addEventListener('change', processCompression);

  function processCompression() {
    if (!currentLoadedImage) return;

    const canvas = document.createElement('canvas');
    canvas.width = currentLoadedImage.width;
    canvas.height = currentLoadedImage.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentLoadedImage, 0, 0);

    const quality = parseFloat(qualitySlider.value) / 100;
    const format = targetFormatSelect.value;

    canvas.toBlob((blob) => {
      if (!blob) return;

      if (compressedBlobUrl) URL.revokeObjectURL(compressedBlobUrl);
      compressedBlobUrl = URL.createObjectURL(blob);

      imgCompressedPreview.src = compressedBlobUrl;
      compSizeLabel.textContent = formatBytes(blob.size);

      const savedPercent = Math.max(0, Math.round(((originalFileSizeBytes - blob.size) / originalFileSizeBytes) * 100));
      savedPercentLabel.textContent = `${savedPercent}%`;
    }, format, quality);
  }

  btnDownloadImg.addEventListener('click', () => {
    if (!compressedBlobUrl) return;
    const link = document.createElement('a');
    link.href = compressedBlobUrl;
    const ext = targetFormatSelect.value === 'image/webp' ? 'webp' : targetFormatSelect.value === 'image/jpeg' ? 'jpg' : 'png';
    link.download = `compressed-omnicraft.${ext}`;
    link.click();
    showToast('Compressed image downloaded!');
  });

  // ----------------------------------------------------
  // 4. TOOL 3: AI SOCIAL BIO & PROMPT ENHANCER
  // ----------------------------------------------------
  const bioInput = document.getElementById('bio-input');
  const btnGenerateBio = document.getElementById('btn-generate-bio');
  const bioOutputText = document.getElementById('bio-output-text');
  const btnCopyBio = document.getElementById('btn-copy-bio');
  const modeChips = document.querySelectorAll('.mode-chip');

  let activeBioMode = 'linkedin';

  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeBioMode = chip.getAttribute('data-biomode');
    });
  });

  btnGenerateBio.addEventListener('click', () => {
    const input = bioInput.value.trim();
    if (!input) {
      showToast('Please enter your bio keywords or prompt!');
      return;
    }

    if (activeBioMode === 'linkedin') {
      bioOutputText.value = `🚀 ${input} | Full Stack Developer | Building Scalable SaaS Products | Passionate about Clean Code & UI/UX Design

Helping businesses scale through modern Web Applications.
📫 Open for collaborations & tech discussions!`;
    } else if (activeBioMode === 'twitter') {
      bioOutputText.value = `Building digital products 🚀 | ${input} | Shipping fast, learning in public | Tech, Code & Coffee ☕`;
    } else {
      bioOutputText.value = `Act as an expert Software Architect and Senior Web Engineer. 
Context: ${input}
Goal: Provide a step-by-step, highly optimized technical solution with clean code examples, performance considerations, and edge case handling. Format with clear markdown headings.`;
    }

    showToast('Bio/Prompt generated!');
  });

  btnCopyBio.addEventListener('click', () => {
    if (!bioOutputText.value) {
      showToast('Generate output first!');
      return;
    }
    navigator.clipboard.writeText(bioOutputText.value);
    showToast('Copied to clipboard!');
  });

  // ----------------------------------------------------
  // 5. TOOL 4: GLASSMORPHISM & SVG WAVE STUDIO
  // ----------------------------------------------------
  const glassBlur = document.getElementById('glass-blur');
  const glassOpacity = document.getElementById('glass-opacity');
  const glassBorder = document.getElementById('glass-border');
  const glassPreview = document.getElementById('glass-live-preview');

  const lblGlassBlur = document.getElementById('lbl-glass-blur');
  const lblGlassOpacity = document.getElementById('lbl-glass-opacity');
  const lblGlassBorder = document.getElementById('lbl-glass-border');
  const btnCopyGlassCss = document.getElementById('btn-copy-glass-css');

  function updateGlassPreview() {
    const blurVal = glassBlur.value;
    const opacityVal = glassOpacity.value;
    const borderVal = glassBorder.value;

    lblGlassBlur.textContent = `${blurVal}px`;
    lblGlassOpacity.textContent = opacityVal;
    lblGlassBorder.textContent = borderVal;

    const innerCard = glassPreview.querySelector('.preview-inner-card');
    innerCard.style.background = `rgba(255, 255, 255, ${opacityVal})`;
    innerCard.style.backdropFilter = `blur(${blurVal}px)`;
    innerCard.style.webkitBackdropFilter = `blur(${blurVal}px)`;
    innerCard.style.borderColor = `rgba(255, 255, 255, ${borderVal})`;
  }

  glassBlur.addEventListener('input', updateGlassPreview);
  glassOpacity.addEventListener('input', updateGlassPreview);
  glassBorder.addEventListener('input', updateGlassPreview);

  btnCopyGlassCss.addEventListener('click', () => {
    const cssCode = `/* Glassmorphism CSS */
background: rgba(255, 255, 255, ${glassOpacity.value});
backdrop-filter: blur(${glassBlur.value}px);
-webkit-backdrop-filter: blur(${glassBlur.value}px);
border: 1px solid rgba(255, 255, 255, ${glassBorder.value});
border-radius: 16px;`;
    navigator.clipboard.writeText(cssCode);
    showToast('Glassmorphism CSS copied!');
  });

  // SVG Wave Engine
  const waveHeight = document.getElementById('wave-height');
  const waveColor = document.getElementById('wave-color');
  const liveSvgPath = document.querySelector('#live-svg-wave path');
  const btnRandomizeWave = document.getElementById('btn-randomize-wave');
  const btnCopySvg = document.getElementById('btn-copy-svg');

  function updateWaveSvg() {
    const h = parseInt(waveHeight.value);
    const color = waveColor.value;
    const pathD = `M0,${h}L48,${h - 20}C96,${h - 40},192,${h - 60},288,${h - 50}C384,${h - 40},480,${h + 20},576,${h + 30}C672,${h + 40},768,${h - 20},864,${h - 40}C960,${h - 60},1056,${h - 40},1152,${h - 20}C1248,0,1344,20,1392,30L1440,40L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z`;
    liveSvgPath.setAttribute('d', pathD);
    liveSvgPath.setAttribute('fill', color);
  }

  waveHeight.addEventListener('input', updateWaveSvg);
  waveColor.addEventListener('input', updateWaveSvg);

  btnRandomizeWave.addEventListener('click', () => {
    waveHeight.value = Math.floor(Math.random() * 180) + 80;
    updateWaveSvg();
    showToast('Wave shape randomized!');
  });

  btnCopySvg.addEventListener('click', () => {
    const svgCode = document.getElementById('svg-wave-preview').innerHTML.trim();
    navigator.clipboard.writeText(svgCode);
    showToast('SVG Code copied to clipboard!');
  });

  // Initialize defaults
  updateGlassPreview();
  updateWaveSvg();
});
