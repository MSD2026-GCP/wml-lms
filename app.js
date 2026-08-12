// Initial Mock Data (Workshop MSD - LMS)
const INITIAL_COURSES = [
  {
    id: "WML-STORY-01",
    title: "Sistem Autentikasi SSO (Single Sign-On)",
    description: "Panduan integrasi SSO kantor menggunakan protokol SAML 2.0 dan OAuth2 untuk login aman siswa dan pengajar dalam satu klik.",
    status: "PUBLISHED",
    videoName: "intro-sso-saml2.mp4",
    pdfName: "sso-integration-guide.pdf",
    category: "Security"
  },
  {
    id: "WML-STORY-02",
    title: "Role-Based Access Control (RBAC) & JWT",
    description: "Mengimplementasikan penentuan hak akses berjenjang (Admin, Pengajar, Siswa) menggunakan otorisasi token JWT di setiap endpoint API.",
    status: "PUBLISHED",
    videoName: "rbac-setup-claims.mp4",
    pdfName: "rbac-security-policy.pdf",
    category: "Development"
  }
];

// State State Management
let courses = [];
let currentFilter = 'ALL'; // 'ALL', 'PUBLISHED', 'DRAFT'

// Elements Selection
const createCourseModal = document.getElementById('createCourseModal');
const createCourseForm = document.getElementById('createCourseForm');
const coursesGrid = document.getElementById('coursesGrid');
const progressSection = document.getElementById('progressSection');
const btnSubmitForm = document.getElementById('btnSubmitForm');

// File inputs and Dropzones
const videoDropZone = document.getElementById('videoDropZone');
const videoFile = document.getElementById('videoFile');
const videoFileInfo = document.getElementById('videoFileInfo');

const pdfDropZone = document.getElementById('pdfDropZone');
const pdfFile = document.getElementById('pdfFile');
const pdfFileInfo = document.getElementById('pdfFileInfo');

// Progress bars & text
const videoProgressBar = document.getElementById('videoProgressBar');
const videoPercent = document.getElementById('videoPercent');
const videoProgressStatus = document.getElementById('videoProgressStatus');
const progressVideoName = document.getElementById('progressVideoName');
const videoProgressItem = document.getElementById('videoProgressItem');

const pdfProgressBar = document.getElementById('pdfProgressBar');
const pdfPercent = document.getElementById('pdfPercent');
const pdfProgressStatus = document.getElementById('pdfProgressStatus');
const progressPdfName = document.getElementById('progressPdfName');
const pdfProgressItem = document.getElementById('pdfProgressItem');

// Metrics Counter elements
const countTotal = document.getElementById('countTotal');
const countPublished = document.getElementById('countPublished');
const countDraft = document.getElementById('countDraft');

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
  // Load data from localStorage
  const savedCourses = localStorage.getItem('wml_courses');
  if (savedCourses) {
    courses = JSON.parse(savedCourses);
  } else {
    courses = [...INITIAL_COURSES];
    localStorage.setItem('wml_courses', JSON.stringify(courses));
  }

  setupEventListeners();
  renderDashboard();
  setupDialogLightDismissFallback();
});

// Setup event listeners
function setupEventListeners() {
  // Tabs switcher event listeners
  document.getElementById('tabAll').addEventListener('click', (e) => switchTab(e, 'ALL'));
  document.getElementById('tabPublished').addEventListener('click', (e) => switchTab(e, 'PUBLISHED'));
  document.getElementById('tabDraft').addEventListener('click', (e) => switchTab(e, 'DRAFT'));

  // Drag & drop for Video
  setupDropZone(videoDropZone, videoFile, 'video/mp4', videoFileInfo, '🎬', 'video.mp4');
  // Drag & drop for PDF
  setupDropZone(pdfDropZone, pdfFile, 'application/pdf', pdfFileInfo, '📄', 'document.pdf');

  // Form submit
  createCourseForm.addEventListener('submit', handleFormSubmit);
}

// Dialog Light-dismiss Fallback (Best Practice)
function setupDialogLightDismissFallback() {
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    createCourseModal.addEventListener('click', (event) => {
      if (event.target !== createCourseModal) return;

      const rect = createCourseModal.getBoundingClientRect();
      const isDialogContent = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );

      if (!isDialogContent) {
        closeCreateModal();
      }
    });
  }
}

// Modal open and close functions
function openCreateModal() {
  // Reset Form
  createCourseForm.reset();
  
  // Reset Dropzones styles
  resetDropZone(videoDropZone, '🎬', 'Maksimum ukuran 100MB (Wajib .mp4)');
  resetDropZone(pdfDropZone, '📄', 'Maksimum ukuran 20MB (Wajib .pdf)');

  // Reset simulated progress trackers
  progressSection.style.display = 'none';
  btnSubmitForm.disabled = false;
  btnSubmitForm.textContent = 'Simpan sebagai Draf';
  
  resetProgressItem(videoProgressItem, videoProgressBar, videoPercent, videoProgressStatus);
  resetProgressItem(pdfProgressItem, pdfProgressBar, pdfPercent, pdfProgressStatus);

  // Show Modal
  createCourseModal.showModal();
}

function closeCreateModal() {
  createCourseModal.close();
}

// Helper to reset dropzone
function resetDropZone(zone, icon, originalText) {
  zone.className = 'dropzone';
  zone.innerHTML = `
    <div class="dropzone-content">
      <span class="dropzone-icon">${icon}</span>
      <p class="dropzone-text">Tarik & lepas file di sini, atau <span class="browse-link">cari file</span></p>
      <p class="file-info-label">${originalText}</p>
    </div>
  `;
}

// Helper to reset progress item
function resetProgressItem(item, bar, percent, status) {
  item.className = 'progress-item';
  bar.style.width = '0%';
  percent.textContent = '0%';
  status.textContent = 'Menunggu antrean...';
}

// Generic Drag & Drop setup function
function setupDropZone(zone, inputElement, fileType, infoLabel, icon, typeName) {
  // Trigger file browser on click
  zone.addEventListener('click', () => {
    inputElement.click();
  });

  // Highlight dropzone on dragover
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });

  // Handle drop file
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file, zone, inputElement, fileType, icon, typeName);
    }
  });

  // Handle manual selection
  inputElement.addEventListener('change', () => {
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      handleFileSelection(file, zone, inputElement, fileType, icon, typeName);
    }
  });
}

function handleFileSelection(file, zone, inputElement, fileType, icon, typeName) {
  // Strict File type validation
  if (file.type !== fileType) {
    showToast(`Format file salah! Harus berupa berkas ${typeName.toUpperCase()}`, 'error');
    inputElement.value = '';
    zone.classList.remove('file-selected');
    return;
  }

  // Update dragzone visual representation to success state
  zone.classList.add('file-selected');
  zone.innerHTML = `
    <div class="dropzone-content">
      <span class="dropzone-icon">✅</span>
      <p class="dropzone-text" style="color: var(--success);">${file.name}</p>
      <p class="file-info-label">File berhasil dipilih (${formatBytes(file.size)})</p>
    </div>
  `;
  
  // Re-enable click listener (since innerHTML overwrote elements, we need the event bubble or handle it)
  // Simply clicking the zone will still trigger inputElement click because zone is parent. 
}

// Helper to format file sizes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Switch tabs and filter courses
function switchTab(event, filter) {
  // Toggle active class in tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  currentFilter = filter;
  renderCoursesList();
}

// Render the entire dashboard UI
function renderDashboard() {
  renderCoursesList();
  renderMetrics();
}

// Recalculate metrics counter
function renderMetrics() {
  const total = courses.length;
  const published = courses.filter(c => c.status === 'PUBLISHED').length;
  const draft = courses.filter(c => c.status === 'DRAFT').length;

  animateCounter(countTotal, total);
  animateCounter(countPublished, published);
  animateCounter(countDraft, draft);
}

// Beautiful simple counter animation
function animateCounter(element, target) {
  const start = parseInt(element.textContent) || 0;
  if (start === target) return;
  
  let current = start;
  const duration = 500; // ms
  const stepTime = Math.abs(Math.floor(duration / (target - start || 1)));
  const timer = setInterval(() => {
    if (start < target) {
      current++;
    } else {
      current--;
    }
    element.textContent = current;
    if (current === target) {
      clearInterval(timer);
    }
  }, Math.max(stepTime, 20));
}

// Render dynamic courses card list
function renderCoursesList() {
  coursesGrid.innerHTML = '';
  
  let filteredCourses = courses;
  if (currentFilter === 'PUBLISHED') {
    filteredCourses = courses.filter(c => c.status === 'PUBLISHED');
  } else if (currentFilter === 'DRAFT') {
    filteredCourses = courses.filter(c => c.status === 'DRAFT');
  }

  if (filteredCourses.length === 0) {
    coursesGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📭</span>
        <p style="font-size: 1.1rem; font-weight: 600;">Belum ada kursus dengan kategori ini</p>
        <p style="font-size: 0.85rem; margin-top: 0.5rem;">Klik tombol "Buat Kursus Baru" untuk mulai menambahkan materi ajar.</p>
      </div>
    `;
    return;
  }

  filteredCourses.forEach(course => {
    const card = document.createElement('article');
    card.className = 'course-card';
    
    const isDraft = course.status === 'DRAFT';
    const statusBadge = isDraft 
      ? `<span class="badge-status draft">Draf</span>` 
      : `<span class="badge-status published">Aktif</span>`;
      
    const mediaEmoji = isDraft ? '📁' : '🎓';

    card.innerHTML = `
      <div class="course-media">
        ${mediaEmoji}
        ${statusBadge}
      </div>
      <div class="course-body">
        <h4>${course.title}</h4>
        <p class="description">${course.description}</p>
        
        <div class="course-attachments">
          <div class="attachment-item">
            <span class="attachment-icon">🎬</span>
            <span class="attachment-name" title="${course.videoName}">${course.videoName}</span>
          </div>
          <div class="attachment-item">
            <span class="attachment-icon">📄</span>
            <span class="attachment-name" title="${course.pdfName}">${course.pdfName}</span>
          </div>
        </div>
      </div>
    `;
    
    coursesGrid.appendChild(card);
  });
}

// Handle Form Submission and multi-staged upload simulation
function handleFormSubmit(event) {
  event.preventDefault();

  const title = document.getElementById('courseTitle').value.trim();
  const desc = document.getElementById('courseDesc').value.trim();

  // Validate files selection
  const vFiles = videoFile.files;
  const pFiles = pdfFile.files;

  if (vFiles.length === 0 && !videoDropZone.classList.contains('file-selected')) {
    showToast('Harap unggah video MP4 materi terlebih dahulu!', 'error');
    return;
  }

  if (pFiles.length === 0 && !pdfDropZone.classList.contains('file-selected')) {
    showToast('Harap unggah dokumen PDF materi terlebih dahulu!', 'error');
    return;
  }

  const vFile = vFiles[0] || { name: 'materi-video.mp4', size: 45000000 };
  const pFile = pFiles[0] || { name: 'materi-bacaan.pdf', size: 3400000 };

  // Setup Progress Names
  progressVideoName.textContent = vFile.name;
  progressPdfName.textContent = pFile.name;

  // Lock Submit button & show simulated upload section
  btnSubmitForm.disabled = true;
  btnSubmitForm.textContent = 'Mengunggah Berkas...';
  progressSection.style.display = 'block';

  // Start Multi-Stage Simulation
  simulateUpload(vFile, pFile, title, desc);
}

// Highly interactive multi-staged file upload simulation
function simulateUpload(vFile, pFile, title, desc) {
  let videoProgress = 0;
  let pdfProgress = 0;

  // STEP 1: Upload Video
  videoProgressItem.classList.add('active');
  videoProgressStatus.textContent = 'Memulai proses unggahan video...';

  const videoInterval = setInterval(() => {
    // Dynamic random step sizes to make the progress bar feel incredibly realistic
    videoProgress += Math.floor(Math.random() * 8) + 2;
    if (videoProgress >= 100) {
      videoProgress = 100;
      clearInterval(videoInterval);
      
      // Video completed, finalize state
      videoProgressBar.style.width = '100%';
      videoPercent.textContent = '100%';
      videoProgressStatus.textContent = 'Selesai diunggah ke GCS Bucket!';
      videoProgressItem.classList.remove('active');
      videoProgressItem.classList.add('complete');

      // Short delay before stepping to PDF upload
      setTimeout(() => {
        // STEP 2: Upload PDF Document
        pdfProgressItem.classList.add('active');
        pdfProgressStatus.textContent = 'Memulai proses unggahan dokumen PDF...';

        const pdfInterval = setInterval(() => {
          pdfProgress += Math.floor(Math.random() * 12) + 3;
          if (pdfProgress >= 100) {
            pdfProgress = 100;
            clearInterval(pdfInterval);

            // PDF completed, finalize state
            pdfProgressBar.style.width = '100%';
            pdfPercent.textContent = '100%';
            pdfProgressStatus.textContent = 'Selesai diunggah ke GCS Bucket!';
            pdfProgressItem.classList.remove('active');
            pdfProgressItem.classList.add('complete');

            // STEP 3: Finalizing & Saving to mock DB
            setTimeout(() => {
              btnSubmitForm.textContent = 'Menyimpan Draf Kursus...';
              
              // Create new course draft
              const newCourse = {
                id: `WML-DRAFT-0${courses.length + 1}`,
                title: title,
                description: desc,
                status: "DRAFT",
                videoName: vFile.name,
                pdfName: pFile.name,
                category: "Draft Module"
              };

              // Push and save
              courses.push(newCourse);
              localStorage.setItem('wml_courses', JSON.stringify(courses));

              // Success finalize delay
              setTimeout(() => {
                closeCreateModal();
                renderDashboard();
                showToast(`Sukses menyimpan draf modul "${title}"!`, 'success');
              }, 600);

            }, 800);
          } else {
            // Update PDF progress
            pdfProgressBar.style.width = `${pdfProgress}%`;
            pdfPercent.textContent = `${pdfProgress}%`;
            pdfProgressStatus.textContent = `Mengunggah berkas (${pdfProgress}%)...`;
          }
        }, 50); // Speed: PDF is smaller so it uploads faster

      }, 600);

    } else {
      // Update Video progress
      videoProgressBar.style.width = `${videoProgress}%`;
      videoPercent.textContent = `${videoProgress}%`;
      videoProgressStatus.textContent = `Mengunggah berkas video (${videoProgress}%)...`;
    }
  }, 60); // Speed: Video is larger so it uploads slightly slower
}

// Toast notification display system
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  else if (type === 'error') icon = '⚠️';

  toast.innerHTML = `
    <span>${icon}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Automatically remove toast from DOM after animation completes (5 seconds total)
  setTimeout(() => {
    toast.remove();
  }, 5000);
}
