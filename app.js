// OmniCraft AI — Main Reactive Logic Engine

document.addEventListener('DOMContentLoaded', () => {
  // Global Toast Notification Helper
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.background = '#8b5cf6';
      toast.style.color = '#fff';
      toast.style.padding = '10px 18px';
      toast.style.borderRadius = '8px';
      toast.style.fontSize = '12px';
      toast.style.fontWeight = '700';
      toast.style.zIndex = '10000';
      toast.style.boxShadow = '0 4px 14px rgba(0,0,0,0.5)';
      toast.style.transition = 'all 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 2800);
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

  // 2. THEME SELECTOR HANDLER
  const selectTheme = document.getElementById('select-theme');
  if (selectTheme) {
    selectTheme.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', e.target.value);
      showToast(`Switched theme to ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // 3. DONATE & UPI QR MODAL HANDLERS
  const modalQr = document.getElementById('modal-qr');
  const btnShowQr = document.getElementById('btn-show-qr');
  const btnHeaderDonate = document.getElementById('btn-header-donate');
  const btnCloseQr = document.getElementById('btn-close-qr');
  const btnModalCopyUpi = document.getElementById('btn-modal-copy-upi');

  function openQrModal() {
    if (modalQr) modalQr.classList.remove('hidden');
  }

  function closeQrModal() {
    if (modalQr) modalQr.classList.add('hidden');
  }

  btnShowQr?.addEventListener('click', openQrModal);
  btnHeaderDonate?.addEventListener('click', openQrModal);
  btnCloseQr?.addEventListener('click', closeQrModal);

  btnModalCopyUpi?.addEventListener('click', () => {
    navigator.clipboard.writeText('omnicraftai@axl');
    showToast('UPI ID (omnicraftai@axl) copied to clipboard!');
  });

  // 4. TOOL 1: AI TEXT SUMMARIZER
  const sumInputText = document.getElementById('sum-input-text');
  const sumToneSelect = document.getElementById('sum-tone');
  const sumLengthSelect = document.getElementById('sum-length');
  const btnGenerateSum = document.getElementById('btn-generate-sum');
  const sumOutputCard = document.getElementById('sum-output-card');
  const sumOutputContent = document.getElementById('sum-output-content');
  const btnCopySum = document.getElementById('btn-copy-sum');
  const btnDownloadSum = document.getElementById('btn-download-sum');
  const btnSampleArticle = document.getElementById('btn-sample-article');
  const btnClearSum = document.getElementById('btn-clear-sum');

  const SAMPLE_ARTICLE = `Artificial intelligence is rapidly transforming software development, business workflows, and creator productivity. Modern developers leverage AI pair-programming tools to build full-stack web applications, write unit tests, and refactor legacy codebases at unprecedented speeds. By automating repetitive boilerplate code and standardizing design systems, small teams can now launch production-ready products in hours rather than months. As client-side browser performance improves, web applications run fully inside the browser without needing heavy backend infrastructure, ensuring total user privacy and instant responsiveness.`;

  btnSampleArticle?.addEventListener('click', () => {
    if (sumInputText) sumInputText.value = SAMPLE_ARTICLE;
  });

  btnClearSum?.addEventListener('click', () => {
    if (sumInputText) sumInputText.value = '';
    if (sumOutputCard) sumOutputCard.classList.add('hidden');
  });

  btnGenerateSum?.addEventListener('click', () => {
    const text = sumInputText?.value.trim();
    if (!text) {
      showToast('Please enter or paste text to summarize!');
      return;
    }

    if (btnGenerateSum) {
      btnGenerateSum.innerHTML = '⚡ Summarizing...';
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

      if (sumOutputContent) {
        sumOutputContent.innerHTML = `<ul>${bullets.join('')}</ul>`;
      }
      if (sumOutputCard) {
        sumOutputCard.classList.remove('hidden');
      }

      if (btnGenerateSum) {
        btnGenerateSum.innerHTML = '<span>⚡</span> Generate Summary';
        btnGenerateSum.disabled = false;
      }
      showToast(`Generated summary with ${countToUse} key points!`);
    }, 300);
  });

  btnCopySum?.addEventListener('click', () => {
    if (sumOutputContent) {
      navigator.clipboard.writeText(sumOutputContent.innerText);
      showToast('Summary copied to clipboard!');
    }
  });

  btnDownloadSum?.addEventListener('click', () => {
    if (sumOutputContent) {
      const blob = new Blob([sumOutputContent.innerText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'omnicraft-summary.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  });

  // 5. TOOL 2: BROWSER-NATIVE IMAGE COMPRESSOR
  const dropZoneImage = document.getElementById('drop-zone-image');
  const inputFileImage = document.getElementById('input-file-image');
  const qualitySlider = document.getElementById('quality-slider');
  const qualityVal = document.getElementById('quality-val');
  const outputFormat = document.getElementById('output-format');
  const imgResultCard = document.getElementById('img-result-card');
  const imgOrigPreview = document.getElementById('img-orig-preview');
  const imgCompPreview = document.getElementById('img-comp-preview');
  const origSizeLabel = document.getElementById('orig-size-label');
  const compSizeLabel = document.getElementById('comp-size-label');
  const btnDownloadComp = document.getElementById('btn-download-comp');

  let currentLoadedFile = null;

  dropZoneImage?.addEventListener('click', () => inputFileImage?.click());

  dropZoneImage?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZoneImage.style.borderColor = '#a855f7';
  });

  dropZoneImage?.addEventListener('dragleave', () => {
    dropZoneImage.style.borderColor = 'rgba(168, 85, 247, 0.4)';
  });

  dropZoneImage?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZoneImage.style.borderColor = 'rgba(168, 85, 247, 0.4)';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageCompress(e.dataTransfer.files[0]);
    }
  });

  inputFileImage?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageCompress(e.target.files[0]);
    }
  });

  qualitySlider?.addEventListener('input', (e) => {
    if (qualityVal) qualityVal.textContent = `${e.target.value}%`;
    if (currentLoadedFile) handleImageCompress(currentLoadedFile);
  });

  outputFormat?.addEventListener('change', () => {
    if (currentLoadedFile) handleImageCompress(currentLoadedFile);
  });

  function handleImageCompress(file) {
    currentLoadedFile = file;
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        if (imgOrigPreview) imgOrigPreview.src = img.src;
        if (origSizeLabel) origSizeLabel.textContent = `Size: ${(file.size / 1024).toFixed(1)} KB`;

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const quality = (qualitySlider ? parseInt(qualitySlider.value) : 80) / 100;
        const format = outputFormat ? outputFormat.value : 'image/webp';

        const compressedDataUrl = canvas.toDataURL(format, quality);
        if (imgCompPreview) imgCompPreview.src = compressedDataUrl;

        // Estimate compressed size
        const head = `data:${format};base64,`;
        const sizeBytes = Math.round((compressedDataUrl.length - head.length) * 3 / 4);
        const reductionPercent = Math.max(0, Math.round((1 - (sizeBytes / file.size)) * 100));

        if (compSizeLabel) compSizeLabel.textContent = `Size: ${(sizeBytes / 1024).toFixed(1)} KB (-${reductionPercent}%)`;
        if (btnDownloadComp) btnDownloadComp.href = compressedDataUrl;
        if (imgResultCard) imgResultCard.classList.remove('hidden');

        showToast('Image compressed locally!');
      };
    };

    reader.readAsDataURL(file);
  }

  // 6. TOOL 3: AI BIO GENERATOR
  const bioRole = document.getElementById('bio-role');
  const bioKeywords = document.getElementById('bio-keywords');
  const bioPlatform = document.getElementById('bio-platform');
  const btnGenerateBio = document.getElementById('btn-generate-bio');
  const bioOutputCard = document.getElementById('bio-output-card');
  const bioResultsList = document.getElementById('bio-results-list');

  btnGenerateBio?.addEventListener('click', () => {
    const role = bioRole?.value.trim() || 'Creator';
    const keywords = bioKeywords?.value.trim() || 'Building Products';
    const platform = bioPlatform?.value || 'twitter';

    const bios = [
      `🚀 ${role} | ${keywords} | Building in public & sharing lessons daily.`,
      `✨ ${role} obsessed with ${keywords}. Let's connect!`,
      `💼 ${role} • ${keywords} • Passionate about tech & innovation.`
    ];

    if (bioResultsList) {
      bioResultsList.innerHTML = bios.map(b => `
        <div style="background: rgba(18,10,35,0.8); border: 1px solid rgba(139,92,246,0.3); padding: 12px; border-radius: 8px; margin-bottom: 8px; font-size: 13px;">
          <p>${b}</p>
        </div>
      `).join('');
    }

    if (bioOutputCard) bioOutputCard.classList.remove('hidden');
    showToast('Generated 3 viral bio options!');
  });
});
