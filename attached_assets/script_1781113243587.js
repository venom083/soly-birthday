document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const homeSection = document.getElementById('home');
  const calendarSection = document.getElementById('calendar');
  const cardsContainer = document.getElementById('cardsContainer');
  const pdfModal = document.getElementById('pdfModal');
  const pdfFrame = document.getElementById('pdfFrame');
  const closeModalBtn = document.getElementById('closeModal');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const mainContent = document.getElementById('mainContent');

  window.checkPassword = function () {
    const password = document.getElementById('passwordInput').value;
    if (password === 'hmada love soly') {
      document.getElementById('passwordScreen').classList.add('hidden');
      mainContent.classList.remove('hidden');
      document.getElementById('bgMusic').play();
    } else {
      alert('كلمة السر غير صحيحة! 💔');
    }
  };

  function getDateOnly(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const startDate = new Date(2025, 6, 24);
  const totalDays = 8;
  const pdfFiles = [
    'pdfs/day1.pdf', 'pdfs/day2.pdf', 'pdfs/day3.pdf',
    'pdfs/day4.pdf', 'pdfs/day5.pdf', 'pdfs/day6.pdf',
    'pdfs/day7.pdf', 'pdfs/day8.pdf'
  ];

  startBtn.addEventListener('click', () => {
    homeSection.classList.add('hidden');
    calendarSection.classList.remove('hidden');
    renderCards();
  });

  function renderCards() {
    cardsContainer.innerHTML = '';
    const today = getDateOnly(new Date());

    for (let i = 0; i < totalDays; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      const dayNumber = currentDay.getDate();
      const monthNumber = currentDay.getMonth() + 1;
      const readableDate = `${dayNumber}/${monthNumber}`;

      const card = document.createElement('div');
      card.classList.add('card');

      if (today >= getDateOnly(currentDay)) {
        card.textContent = `اليوم ${i + 1} (${readableDate}) 🌸`;
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `افتح هدية يوم ${i + 1}`);
        card.addEventListener('click', () => openPdf(pdfFiles[i], readableDate));
      } else {
        card.textContent = `اليوم ${i + 1} (${readableDate}) - مقفل 🔒`;
        card.classList.add('locked');
        card.tabIndex = -1;
      }
      cardsContainer.appendChild(card);
    }
  }

  function openPdf(file, dateLabel) {
    pdfFrame.src = file;
    pdfModal.classList.remove('hidden');
    downloadPdfBtn.href = file;
    downloadPdfBtn.setAttribute('download', `هدية-${dateLabel}.pdf`);
    trapFocus(pdfModal);
  }

  function closeModal() {
    pdfModal.classList.add('hidden');
    pdfFrame.src = '';
    downloadPdfBtn.href = '#';
    removeTrapFocus();
  }

  closeModalBtn.addEventListener('click', closeModal);
  pdfModal.addEventListener('click', (e) => {
    if (e.target === pdfModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!pdfModal.classList.contains('hidden') && e.key === 'Escape') {
      closeModal();
    }
  });

  let lastFocusedElement = null;
  function trapFocus(modal) {
    lastFocusedElement = document.activeElement;
    const focusable = modal.querySelectorAll('a, button, iframe, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    function handleTab(e) {
      const focusableEls = Array.from(focusable);
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    modal.addEventListener('keydown', handleTab);
    modal._handleTab = handleTab;
  }

  function removeTrapFocus() {
    if (lastFocusedElement) lastFocusedElement.focus();
    pdfModal.removeEventListener('keydown', pdfModal._handleTab || (() => {}));
  }
});
