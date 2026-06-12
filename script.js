const STORAGE_KEY = 'siperfas_submissions';



const SEED_DATA = [
  {
    id: 'LPR-2026-001',
    nama: 'Aulia Rahmawati',
    nim: '2010817320012',
    prodi: 'Ilmu Komputer',
    fakultas: 'Fakultas MIPA',
    fasilitas: 'AC / Pendingin Ruangan',
    lokasi: 'Gedung MIPA Lt. 2, Ruang 2.04',
    urgensi: 'tinggi',
    deskripsi: 'AC di ruang 2.04 tidak dingin sama sekali sejak minggu lalu. Suhu ruangan menjadi sangat panas terutama di siang hari saat perkuliahan.',
    status: 'proses',
    tanggal: '2026-05-22T08:30:00'
  },
  {
    id: 'LPR-2026-002',
    nama: 'Muhammad Fadhil',
    nim: '2010817210031',
    prodi: 'Teknik Sipil',
    fakultas: 'Fakultas Teknik',
    fasilitas: 'Proyektor',
    lokasi: 'Gedung Teknik Lt. 1, Ruang T-103',
    urgensi: 'sedang',
    deskripsi: 'Proyektor tidak menampilkan gambar dengan jelas. Warna pudar dan ada garis horizontal di tengah layar.',
    status: 'menunggu',
    tanggal: '2026-05-24T13:15:00'
  },
  {
    id: 'LPR-2026-003',
    nama: 'Salsabila Putri',
    nim: '2010817220045',
    prodi: 'Manajemen',
    fakultas: 'Fakultas Ekonomi & Bisnis',
    fasilitas: 'Lampu / Penerangan',
    lokasi: 'Gedung FEB Lt. 3, Koridor',
    urgensi: 'rendah',
    deskripsi: 'Tiga lampu di koridor lantai 3 mati. Cukup gelap saat sore hari.',
    status: 'selesai',
    tanggal: '2026-05-18T10:00:00'
  },
  {
    id: 'LPR-2026-004',
    nama: 'Bayu Pratama',
    nim: '2010817110018',
    prodi: 'Pendidikan Bahasa Inggris',
    fakultas: 'FKIP',
    fasilitas: 'Stop Kontak / Listrik',
    lokasi: 'Gedung FKIP Lt. 2, Ruang FKIP-205',
    urgensi: 'darurat',
    deskripsi: 'Ada stop kontak yang mengeluarkan percikan api saat dicolok charger laptop. Berbahaya, mohon segera ditangani.',
    status: 'proses',
    tanggal: '2026-05-25T15:42:00'
  },
  {
    id: 'LPR-2026-005',
    nama: 'Nurul Hidayah',
    nim: '2010817330007',
    prodi: 'Hukum',
    fakultas: 'Fakultas Hukum',
    fasilitas: 'Kursi / Meja',
    lokasi: 'Gedung FH Lt. 1, Ruang Sidang Semu',
    urgensi: 'sedang',
    deskripsi: 'Beberapa kursi di ruang sidang semu rusak — sandaran lepas dan kaki kursi goyang. Total ada 6 kursi yang perlu diganti.',
    status: 'menunggu',
    tanggal: '2026-05-23T09:20:00'
  },
  {
    id: 'LPR-2026-006',
    nama: 'Rizky Maulana',
    nim: '2010817520009',
    prodi: 'Ilmu Kelautan',
    fakultas: 'Fakultas Perikanan & Kelautan',
    fasilitas: 'WiFi / Jaringan Internet',
    lokasi: 'Gedung FPK Lt. 2',
    urgensi: 'tinggi',
    deskripsi: 'WiFi kampus di lantai 2 putus-putus dan sering disconnect. Sangat mengganggu saat kuliah online dan akses jurnal.',
    status: 'selesai',
    tanggal: '2026-05-15T11:30:00'
  }
];


function loadSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return [...SEED_DATA];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal memuat data, gunakan seed:', e);
    return [...SEED_DATA];
  }
}

function saveSubmissions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function generateId(list) {
  const year = new Date().getFullYear();
  const used = list
    .filter(s => s.id.startsWith(`LPR-${year}-`))
    .map(s => parseInt(s.id.split('-')[2], 10))
    .filter(n => !isNaN(n));
  const next = used.length ? Math.max(...used) + 1 : 1;
  return `LPR-${year}-${String(next).padStart(3, '0')}`;
}

function formatTanggal(iso) {
  const d = new Date(iso);
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
                 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = bulan[d.getMonth()];
  const year = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} • ${hour}:${min} WITA`;
}

function getInitials(nama) {
  return nama.split(' ')
    .map(w => w.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


function showToast(type, title, message, duration = 4000) {
  
  if ($('.toast-stack').length === 0) {
    $('body').append('<div class="toast-stack" aria-live="polite"></div>');
  }

  const iconMap = {
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    danger:  'bi-x-circle-fill',
    info:    'bi-info-circle-fill'
  };
  const icon = iconMap[type] || iconMap.info;

  const $toast = $(`
    <div class="siperfas-toast ${type}" role="alert">
      <div class="siperfas-toast-title">
        <i class="bi ${icon}"></i> ${escapeHtml(title)}
      </div>
      <div class="siperfas-toast-body">${escapeHtml(message)}</div>
    </div>
  `);

  $('.toast-stack').append($toast);

  
  $toast.fadeIn(280);

  
  setTimeout(() => {
    $toast.fadeOut(360, function() { $(this).remove(); });
  }, duration);

  
  $toast.on('click', function() {
    $(this).fadeOut(200, function() { $(this).remove(); });
  });
}


function initNavbar() {
  
  const current = window.location.pathname.split('/').pop() || 'index.html';
  $('.navbar-siperfas .nav-link').each(function() {
    const href = $(this).attr('href');
    if (href === current ||
        (current === '' && href === 'index.html')) {
      $(this).addClass('active');
    }
  });

  
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > 10) {
      $('.navbar-siperfas').addClass('scrolled');
    } else {
      $('.navbar-siperfas').removeClass('scrolled');
    }
  });
}


function initScrollAnimations() {
  const $items = $('.fade-in-up');
  if ($items.length === 0) return;

  function checkVisible() {
    const trigger = $(window).scrollTop() + $(window).height() - 80;
    $items.each(function() {
      if (!$(this).hasClass('visible') && $(this).offset().top < trigger) {
        $(this).addClass('visible');
      }
    });
  }

  
  $items.each(function(i) {
    $(this).css('transition-delay', (i % 4) * 0.08 + 's');
  });

  $(window).on('scroll resize', checkVisible);
  checkVisible(); 
}


function initPengajuanForm() {
  const $form = $('#formPengajuan');
  if ($form.length === 0) return;

  
  const $desc = $('#deskripsi');
  const $counter = $('#descCounter');
  const MAX_DESC = 500;

  $desc.on('input', function() {
    const len = $(this).val().length;
    $counter.text(`${len} / ${MAX_DESC} karakter`);
    if (len > MAX_DESC * 0.9) {
      $counter.addClass('warn');
    } else {
      $counter.removeClass('warn');
    }
  });

  
  $form.find('.form-control, .form-select').on('input change', function() {
    $(this).removeClass('is-invalid');
  });

  
  const prodiByFakultas = {
    'Fakultas Teknik': [
      'Teknik Sipil','Teknik Mesin','Teknik Kimia','Teknik Lingkungan',
      'Arsitektur','Teknik Pertambangan','Teknik Industri','Teknologi Informasi'
    ],
    'Fakultas MIPA': [
      'Matematika','Fisika','Kimia','Biologi','Ilmu Komputer','Statistika','Farmasi'
    ],
    'Fakultas Ekonomi & Bisnis': [
      'Manajemen','Akuntansi','Ekonomi Pembangunan'
    ],
    'Fakultas Hukum': ['Hukum'],
    'Fakultas Kedokteran': ['Kedokteran','Psikologi','Keperawatan'],
    'Fakultas Pertanian': [
      'Agroteknologi','Agribisnis','Ilmu Tanah','Peternakan','Kehutanan'
    ],
    'Fakultas Perikanan & Kelautan': [
      'Budidaya Perairan','Manajemen Sumber Daya Perairan','Ilmu Kelautan',
      'Teknologi Hasil Perikanan'
    ],
    'FKIP': [
      'Pendidikan Matematika','Pendidikan Fisika','Pendidikan Kimia',
      'Pendidikan Biologi','Pendidikan Bahasa Inggris','Pendidikan Bahasa Indonesia',
      'PGSD','Pendidikan Sejarah','Bimbingan Konseling','PG-PAUD'
    ],
    'FISIP': [
      'Ilmu Pemerintahan','Sosiologi','Ilmu Administrasi Bisnis',
      'Ilmu Administrasi Publik','Ilmu Komunikasi'
    ]
  };

  $('#fakultas').on('change', function() {
    const fak = $(this).val();
    const $prodi = $('#prodi');
    $prodi.empty().append('<option value="">— Pilih program studi —</option>');
    if (fak && prodiByFakultas[fak]) {
      prodiByFakultas[fak].forEach(p => {
        $prodi.append(`<option value="${p}">${p}</option>`);
      });
      $prodi.prop('disabled', false);
    } else {
      $prodi.prop('disabled', true);
    }
  });

  
  $form.on('submit', function(e) {
    e.preventDefault();

    let valid = true;
    const data = {};

    
    const required = [
      { id: 'nama',       label: 'Nama lengkap' },
      { id: 'nim',        label: 'NIM' },
      { id: 'fakultas',   label: 'Fakultas' },
      { id: 'prodi',      label: 'Program studi' },
      { id: 'fasilitas',  label: 'Jenis fasilitas' },
      { id: 'lokasi',     label: 'Lokasi fasilitas' },
      { id: 'deskripsi',  label: 'Deskripsi kerusakan' }
    ];

    required.forEach(f => {
      const $el = $('#' + f.id);
      const val = ($el.val() || '').trim();
      if (!val) {
        $el.addClass('is-invalid');
        valid = false;
      } else {
        data[f.id] = val;
      }
    });

    
    const nim = $('#nim').val().trim();
    if (nim && !/^\d{8,15}$/.test(nim)) {
      $('#nim').addClass('is-invalid');
      $('#nimFeedback').text('NIM harus berupa angka 8–15 digit.');
      valid = false;
    }

    
    const urgensi = $('input[name="urgensi"]:checked').val();
    if (!urgensi) {
      $('#urgensiFeedback').show();
      valid = false;
    } else {
      $('#urgensiFeedback').hide();
      data.urgensi = urgensi;
    }

    
    if (data.deskripsi && data.deskripsi.length < 15) {
      $('#deskripsi').addClass('is-invalid');
      $('#deskripsiFeedback').text('Mohon jelaskan kerusakan minimal 15 karakter.');
      valid = false;
    }

    if (!valid) {
      showToast('danger', 'Form belum lengkap',
        'Mohon periksa kembali kolom yang ditandai merah.');
      
      const $firstInvalid = $form.find('.is-invalid').first();
      if ($firstInvalid.length) {
        $('html, body').animate({
          scrollTop: $firstInvalid.offset().top - 120
        }, 400);
      }
      return;
    }

    
    const list = loadSubmissions();
    const submission = {
      id: generateId(list),
      nama: data.nama,
      nim: data.nim,
      prodi: data.prodi,
      fakultas: data.fakultas,
      fasilitas: data.fasilitas,
      lokasi: data.lokasi,
      urgensi: data.urgensi,
      deskripsi: data.deskripsi,
      status: 'menunggu',
      tanggal: new Date().toISOString()
    };

    
    const $submitBtn = $('#btnSubmit');
    const originalHtml = $submitBtn.html();
    $submitBtn.prop('disabled', true)
      .html('<span class="spinner-border spinner-border-sm me-2" role="status"></span>Memproses...');

    setTimeout(() => {
      list.unshift(submission); 
      saveSubmissions(list);

      $submitBtn.prop('disabled', false).html(originalHtml);

      
      $('#successModal .submission-id-result').text(submission.id);
      const modal = new bootstrap.Modal(document.getElementById('successModal'));
      modal.show();

      
      $form[0].reset();
      $counter.text(`0 / ${MAX_DESC} karakter`).removeClass('warn');
      $('#prodi').prop('disabled', true).empty()
        .append('<option value="">— Pilih fakultas dulu —</option>');
    }, 650);
  });

  
  $('#btnReset').on('click', function() {
    if (confirm('Yakin ingin menghapus semua isian form?')) {
      $form[0].reset();
      $form.find('.is-invalid').removeClass('is-invalid');
      $counter.text(`0 / ${MAX_DESC} karakter`).removeClass('warn');
      $('#prodi').prop('disabled', true).empty()
        .append('<option value="">— Pilih fakultas dulu —</option>');
      showToast('info', 'Form direset', 'Semua isian telah dikosongkan.');
    }
  });
}





function initDaftarPage() {
  const $list = $('#submissionList');
  if ($list.length === 0) return;

  let currentFilter = 'semua';
  let currentSearch = '';

  function renderList() {
    const all = loadSubmissions();
    let filtered = all;

    
    if (currentFilter !== 'semua') {
      filtered = filtered.filter(s => s.status === currentFilter);
    }

    
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(q) ||
        s.nama.toLowerCase().includes(q) ||
        s.fasilitas.toLowerCase().includes(q) ||
        s.lokasi.toLowerCase().includes(q) ||
        s.deskripsi.toLowerCase().includes(q) ||
        s.fakultas.toLowerCase().includes(q)
      );
    }

    
    $('#totalCount').text(all.length);
    $('#filteredCount').text(filtered.length);

    
    $list.empty();

    if (filtered.length === 0) {
      $list.html(`
        <div class="col-12">
          <div class="empty-state">
            <i class="bi bi-inbox"></i>
            <h4>Belum ada pengajuan ditemukan</h4>
            <p>${currentSearch || currentFilter !== 'semua'
              ? 'Coba ubah filter atau kata kunci pencarian.'
              : 'Belum ada pengajuan perbaikan fasilitas yang masuk.'}</p>
          </div>
        </div>
      `);
      return;
    }

    filtered.forEach((s, idx) => {
      const $card = $(`
        <div class="col-md-6 col-xl-4 fade-in-up">
          <article class="submission-card">
            <div class="submission-header">
              <span class="submission-id">${escapeHtml(s.id)}</span>
              <span class="status-badge ${escapeHtml(s.status)}">
                <i class="bi ${statusIcon(s.status)}"></i>
                ${statusLabel(s.status)}
              </span>
            </div>
            <h3 class="submission-title">
              <span class="urgensi-dot ${escapeHtml(s.urgensi)}"
                title="Urgensi: ${escapeHtml(s.urgensi)}"></span>
              ${escapeHtml(s.fasilitas)}
            </h3>
            <div class="submission-meta">
              <span><i class="bi bi-geo-alt"></i> ${escapeHtml(s.lokasi)}</span>
              <span><i class="bi bi-tag"></i> ${escapeHtml(urgensiLabel(s.urgensi))}</span>
            </div>
            <p class="submission-desc">${escapeHtml(s.deskripsi)}</p>
            <div class="submission-footer">
              <div class="submitter-info">
                <span class="submitter-avatar">${getInitials(s.nama)}</span>
                <div>
                  <div style="font-weight:600;color:var(--color-text);font-size:.85rem">
                    ${escapeHtml(s.nama)}
                  </div>
                  <div style="font-size:.75rem">${escapeHtml(s.fakultas)}</div>
                </div>
              </div>
              <span title="${escapeHtml(s.tanggal)}">
                <i class="bi bi-clock"></i> ${formatTanggal(s.tanggal)}
              </span>
            </div>
          </article>
        </div>
      `);
      $list.append($card);

      
      setTimeout(() => {
        $card.find('.fade-in-up, .submission-card').addClass('visible');
      }, idx * 50);
    });

    
    $list.find('.fade-in-up').addClass('visible');
  }

  
  $('.filter-bar').on('click', '.chip', function() {
    $(this).siblings('.chip').removeClass('active');
    $(this).addClass('active');
    currentFilter = $(this).data('filter');
    renderList();
  });

  
  $('#searchInput').on('input', function() {
    currentSearch = $(this).val().trim();
    renderList();
  });

  
  $('#btnClearData').on('click', function() {
    if (confirm('Hapus semua data pengajuan? Data simulasi awal akan dimuat kembali.')) {
      localStorage.removeItem(STORAGE_KEY);
      showToast('warning', 'Data dihapus',
        'Semua pengajuan telah direset ke data simulasi awal.');
      renderList();
    }
  });

  
  renderList();
}

function statusIcon(status) {
  return {
    menunggu: 'bi-hourglass-split',
    proses:   'bi-gear-fill',
    selesai:  'bi-check-circle-fill'
  }[status] || 'bi-circle';
}

function statusLabel(status) {
  return {
    menunggu: 'Menunggu',
    proses:   'Diproses',
    selesai:  'Selesai'
  }[status] || status;
}

function urgensiLabel(level) {
  return {
    rendah:  'Urgensi Rendah',
    sedang:  'Urgensi Sedang',
    tinggi:  'Urgensi Tinggi',
    darurat: 'DARURAT'
  }[level] || level;
}





function initStatCounters() {
  const $stats = $('.hero-stat-value[data-target]');
  if ($stats.length === 0) return;

  $stats.each(function() {
    const $el = $(this);
    const targetRaw = $el.data('target');
    const target = parseInt(targetRaw, 10);
    const suffix = $el.data('suffix') || '';
    const fallback = $el.data('label') || 'Data Simulasi';

    if (Number.isNaN(target)) {
      $el.text(fallback);
      return;
    }

    const duration = 1400;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        $el.text(target.toLocaleString('id-ID') + suffix);
        clearInterval(timer);
      } else {
        $el.text(Math.floor(current).toLocaleString('id-ID') + suffix);
      }
    }, duration / steps);
  });
}

$(document).ready(function() {
  initNavbar();
  initScrollAnimations();
  initPengajuanForm();
  initDaftarPage();
  initStatCounters();

  
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this).attr('href');
    if (target.length > 1 && $(target).length) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: $(target).offset().top - 80
      }, 500);
    }
  });

  
  if (!sessionStorage.getItem('siperfas_welcomed')) {
    sessionStorage.setItem('siperfas_welcomed', '1');
    setTimeout(() => {
      const page = window.location.pathname.split('/').pop();
      if (page === '' || page === 'index.html') {
        showToast('info', 'Selamat datang!',
          'SIPERFAS — Sistem Pengajuan Perbaikan Fasilitas Kampus.', 3500);
      }
    }, 800);
  }
});
