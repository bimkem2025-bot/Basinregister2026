const state = {
  existingClients: [],
  generatedRegisters: [],
  services: {
    Bapas: ["Litmas", "Pendampingan", "Wajib Lapor"],
    Rutan: ["Asesmen Awal", "Pembinaan", "Integrasi"],
    Lapas: ["Pembimbingan", "Asimilasi", "Reintegrasi"],
  },
};

const el = {
  existingSearch: document.getElementById("existingSearch"),
  existingList: document.getElementById("existingList"),
  refreshClientsBtn: document.getElementById("refreshClientsBtn"),
  checkClientBtn: document.getElementById("checkClientBtn"),
  checkStatus: document.getElementById("checkStatus"),
  entrySection: document.getElementById("entrySection"),
  clientForm: document.getElementById("clientForm"),
  tanggalLahir: document.getElementById("tanggalLahir"),
  tanggalAcuan: document.getElementById("tanggalAcuan"),
  usiaHariIni: document.getElementById("usiaHariIni"),
  usiaAcuan: document.getElementById("usiaAcuan"),
  serviceCategory: document.getElementById("serviceCategory"),
  serviceType: document.getElementById("serviceType"),
  multiServices: document.getElementById("multiServices"),
  generateRegisterBtn: document.getElementById("generateRegisterBtn"),
  registerResult: document.getElementById("registerResult"),
  saveStatus: document.getElementById("saveStatus"),
};

const DEFAULT_GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0-Yhc2MNtVqV8FKfMlQV4_7dxrnOLDyqfrWl6lkiqGRlFyUlC9i3QXE59N2AbTDRX/exec";
const API_URL = window.GAS_WEB_APP_URL || DEFAULT_GAS_WEB_APP_URL;

function renderSelect(selectEl, options, placeholder = "Pilih...") {
  selectEl.innerHTML = "";
  if (!selectEl.multiple) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = placeholder;
    selectEl.appendChild(defaultOption);
  }

  options.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
}

function renderExistingList() {
  const query = el.existingSearch.value.trim().toLowerCase();
  const filtered = state.existingClients.filter((item) =>
    item.toLowerCase().includes(query)
  );

  el.existingList.innerHTML = "";
  filtered.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    el.existingList.appendChild(option);
  });
}

function calculateAgeYMD(birthDateString, referenceDateString = "") {
  if (!birthDateString) return "-";
  const birthDate = new Date(birthDateString);
  const reference = referenceDateString ? new Date(referenceDateString) : new Date();
  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(reference.getTime())) return "-";
  if (reference < birthDate) return "0 tahun 0 bulan 0 hari";

  let years = reference.getFullYear() - birthDate.getFullYear();
  let months = reference.getMonth() - birthDate.getMonth();
  let days = reference.getDate() - birthDate.getDate();

  if (days < 0) {
    const previousMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
    days += previousMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return `${years} tahun ${months} bulan ${days} hari`;
}

function ageGroupFromText(ageText) {
  const years = Number(ageText.split(" ")[0] || 0);
  if (years < 6) return "BALITA";
  if (years < 18) return "ANAK";
  if (years < 60) return "DEWASA";
  return "LANSIA";
}

function registerPrefix(service) {
  return service
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3)
    .padEnd(3, "X");
}

function generateRegisterNumber(service, ageText) {
  const group = ageGroupFromText(ageText);
  const yy = String(new Date().getFullYear()).slice(-2);
  const sequence = String(Math.floor(Math.random() * 90000) + 10000);
  return `${registerPrefix(service)}-${group}-${yy}${sequence}`;
}

function updateServices() {
  const category = el.serviceCategory.value;
  const options = state.services[category] || [];
  renderSelect(el.serviceType, options, "Pilih layanan utama");
  renderSelect(el.multiServices, options);
}

async function apiGet(action) {
  if (!API_URL) throw new Error("GAS_WEB_APP_URL belum diisi.");
  const response = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`);
  if (!response.ok) throw new Error("Gagal mengambil data dari Apps Script.");
  return response.json();
}

async function apiPost(payload) {
  if (!API_URL) throw new Error("GAS_WEB_APP_URL belum diisi.");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Gagal kirim data ke Apps Script.");
  return response.json();
}

async function loadExistingClients() {
  el.checkStatus.textContent = "Memuat data klien dari Google Sheets...";
  try {
    const result = await apiGet("listClients");
    state.existingClients = result.data || [];
    renderExistingList();
    el.checkStatus.textContent = `${state.existingClients.length} data berhasil dimuat.`;
  } catch (error) {
    state.existingClients = ["CONTOH KLIEN A", "CONTOH KLIEN B"];
    renderExistingList();
    el.checkStatus.textContent =
      "Gagal konek ke GAS. Menampilkan data demo. Pastikan Deployment ID aktif dan GAS_WEB_APP_URL benar.";
  }
}

async function checkClient() {
  const selected = el.existingList.value || el.existingSearch.value.trim();
  if (!selected) {
    el.checkStatus.textContent = "Pilih atau ketik data klien yang ingin dicek.";
    return;
  }

  el.checkStatus.textContent = "Mengecek keberadaan klien...";
  try {
    const response = await apiPost({ action: "checkClient", keyword: selected });
    if (response.exists) {
      el.entrySection.classList.add("hidden");
      el.checkStatus.textContent = `Klien sudah terdaftar: ${response.match}`;
      return;
    }

    el.entrySection.classList.remove("hidden");
    el.checkStatus.textContent = "Klien belum ada. Silakan isi form entri klien baru.";
  } catch (error) {
    const localExists = state.existingClients.some(
      (item) => item.toLowerCase() === selected.toLowerCase()
    );
    if (localExists) {
      el.entrySection.classList.add("hidden");
      el.checkStatus.textContent = `Klien sudah terdaftar (mode lokal): ${selected}`;
      return;
    }
    el.entrySection.classList.remove("hidden");
    el.checkStatus.textContent = "Mode lokal: klien tidak ditemukan, lanjut entri baru.";
  }
}

function updateAges() {
  const birth = el.tanggalLahir.value;
  const reference = el.tanggalAcuan.value;
  el.usiaHariIni.textContent = calculateAgeYMD(birth);
  el.usiaAcuan.textContent = calculateAgeYMD(birth, reference);
}

function generateRegisters() {
  const utama = el.serviceType.value;
  const tambahan = Array.from(el.multiServices.selectedOptions).map((o) => o.value);
  const ageText = el.usiaHariIni.textContent;

  if (!utama || ageText === "-") {
    el.registerResult.innerHTML = "<li>Pilih tanggal lahir dan layanan dulu.</li>";
    return;
  }

  const services = [utama, ...tambahan.filter((item) => item !== utama)];
  state.generatedRegisters = services.map((service) => ({
    service,
    nomor: generateRegisterNumber(service, ageText),
  }));

  el.registerResult.innerHTML = state.generatedRegisters
    .map((item) => `<li><strong>${item.service}</strong>: ${item.nomor}</li>`)
    .join("");
}

async function submitClient(event) {
  event.preventDefault();

  if (!state.generatedRegisters.length) {
    el.saveStatus.textContent = "Generate nomor register dulu sebelum menyimpan.";
    return;
  }

  const formData = new FormData(el.clientForm);
  const payload = Object.fromEntries(formData.entries());
  payload.usiaHariIni = el.usiaHariIni.textContent;
  payload.usiaAcuan = el.usiaAcuan.textContent;
  payload.registers = state.generatedRegisters;

  el.saveStatus.textContent = "Menyimpan data ke Google Sheets...";
  try {
    const result = await apiPost({ action: "createClient", payload });
    el.saveStatus.textContent = `Berhasil simpan. Row: ${result.row || "-"}.`;
    el.clientForm.reset();
    el.registerResult.innerHTML = "";
    state.generatedRegisters = [];
    el.usiaHariIni.textContent = "-";
    el.usiaAcuan.textContent = "-";
    await loadExistingClients();
  } catch (error) {
    el.saveStatus.textContent =
      "Gagal simpan ke GAS. Cek deployment web app, izin akses, dan nama sheet target.";
  }
}

function init() {
  renderSelect(el.serviceCategory, Object.keys(state.services), "Pilih kategori");
  updateServices();

  el.existingSearch.addEventListener("input", renderExistingList);
  el.refreshClientsBtn.addEventListener("click", loadExistingClients);
  el.checkClientBtn.addEventListener("click", checkClient);
  el.tanggalLahir.addEventListener("change", updateAges);
  el.tanggalAcuan.addEventListener("change", updateAges);
  el.serviceCategory.addEventListener("change", updateServices);
  el.generateRegisterBtn.addEventListener("click", generateRegisters);
  el.clientForm.addEventListener("submit", submitClient);

  loadExistingClients();
}

init();
