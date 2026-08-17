/**
 * Notification API Tester & Simulator Logic
 */

// Define Default State values
const DEFAULTS = {
  apiHost: 'http://localhost:3000',
  pathList: '/api/notifications',
  pathRead: '/api/notifications/{id}/read',
  pathReadAll: '/api/notifications/read-all',
  pathCreate: '/api/notifications'
};

// Database for Mock API (stored in LocalStorage)
const MOCK_DB_KEY = 'api_tester_mock_db';
const SETTINGS_KEY = 'api_tester_settings';

// Mock Data Initial Seed
const DEFAULT_MOCK_NOTIFICATIONS = [
  {
    id: "noti_sys_1",
    title: "Cảnh báo bảo mật hệ thống",
    content: "Phát hiện địa chỉ IP lạ (113.23.45.92) cố gắng đăng nhập vào tài khoản quản trị của bạn.",
    type: "SYSTEM",
    channel: "SYSTEM",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    id: "noti_sms_1",
    title: "Ngân Hàng Alert",
    content: "GD +2,000,000 VND vao luc 15:45. SD cuoi: 15,240,000 VND. Noi dung: Nhận lương tháng 8.",
    type: "SMS",
    channel: "SMS",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: "noti_email_1",
    title: "Hóa đơn thanh toán dịch vụ Cloud #4928A",
    content: "Xin chào quý khách. Giao dịch thanh toán tự động gói dịch vụ Cloud Pro tháng 8 trị giá $29.00 đã được thực hiện thành công. Hóa đơn chi tiết được đính kèm bên dưới. Cảm ơn quý khách đã tin dùng.",
    type: "EMAIL",
    channel: "EMAIL",
    isRead: true,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString()
  },
  {
    id: "noti_push_1",
    title: "🎉 Bạn có 1 tin nhắn mới từ Lan Anh",
    content: "Lan Anh: 'Tối nay 8h mình đi uống cafe ở chỗ cũ nhé, nhớ đến đúng giờ nha!'",
    type: "PUSH",
    channel: "PUSH",
    isRead: false,
    createdAt: new Date(Date.now() - 180 * 60000).toISOString()
  }
];

// App State Manager
class AppState {
  constructor() {
    this.settings = this.loadSettings();
    this.isMockMode = this.loadMockMode();
    this.mockDb = this.loadMockDb();
    this.activeSimTab = 'sim-list';
  }

  loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return { ...DEFAULTS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULTS;
      }
    }
    return DEFAULTS;
  }

  saveSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  }

  loadMockMode() {
    const saved = localStorage.getItem('api_tester_mock_mode');
    return saved === 'true' || saved === null; // default to true to allow immediate play
  }

  saveMockMode(val) {
    this.isMockMode = val;
    localStorage.setItem('api_tester_mock_mode', val);
  }

  loadMockDb() {
    const saved = localStorage.getItem(MOCK_DB_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_MOCK_NOTIFICATIONS;
      }
    }
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(DEFAULT_MOCK_NOTIFICATIONS));
    return DEFAULT_MOCK_NOTIFICATIONS;
  }

  saveMockDb() {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(this.mockDb));
  }

  addMockNotification(noti) {
    const newNoti = {
      id: 'noti_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false,
      ...noti
    };
    this.mockDb.unshift(newNoti);
    this.saveMockDb();
    return newNoti;
  }

  readMockNotification(id) {
    const noti = this.mockDb.find(n => n.id === id);
    if (noti) {
      noti.isRead = true;
      this.saveMockDb();
      return true;
    }
    return false;
  }

  readAllMockNotifications() {
    this.mockDb.forEach(n => n.isRead = true);
    this.saveMockDb();
    return true;
  }

  clearMockDb() {
    this.mockDb = [];
    this.saveMockDb();
  }
}

const state = new AppState();

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  initDOM();
  bindEvents();
  loadSettingsToUI();
  updateMockModeUI();
  
  // Set default Create Payload
  loadTemplate('SYSTEM');
  
  // Update time widgets
  updateTimeWidgets();
  setInterval(updateTimeWidgets, 60000);

  // Initial draw
  refreshSimulatorUI();
});

// Cache DOM Elements
let el = {};
function initDOM() {
  el = {
    // Header controls
    mockModeToggle: document.getElementById('mockModeToggle'),
    mockModeSlider: document.getElementById('mockModeSlider'),
    bellButton: document.getElementById('bellButton'),
    bellBadge: document.getElementById('bellBadge'),
    bellSvg: document.getElementById('bellSvg'),
    bellDropdown: document.getElementById('bellDropdown'),
    clearSystemNotifications: document.getElementById('clearSystemNotifications'),
    systemDropdownList: document.getElementById('systemDropdownList'),
    
    // API Host Setting
    apiHostInput: document.getElementById('apiHostInput'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    
    // Tabs
    apiTabs: document.querySelectorAll('.api-tab-btn'),
    apiTabContents: document.querySelectorAll('.api-tab-content'),
    
    // Path Override Inputs
    overrideListPath: document.getElementById('overrideListPath'),
    overrideReadPath: document.getElementById('overrideReadPath'),
    overrideReadAllPath: document.getElementById('overrideReadAllPath'),
    overrideCreatePath: document.getElementById('overrideCreatePath'),
    
    // API Action Elements
    paramPage: document.getElementById('paramPage'),
    paramLimit: document.getElementById('paramLimit'),
    sendListRequestBtn: document.getElementById('sendListRequestBtn'),
    
    readNotiId: document.getElementById('readNotiId'),
    sendReadRequestBtn: document.getElementById('sendReadRequestBtn'),
    
    sendReadAllRequestBtn: document.getElementById('sendReadAllRequestBtn'),
    
    createPayload: document.getElementById('createPayload'),
    sendCreateRequestBtn: document.getElementById('sendCreateRequestBtn'),
    payloadTemplateBtns: document.querySelectorAll('.payload-template-btn'),
    
    // Output Console
    statusIndicator: document.getElementById('statusIndicator'),
    responseStatus: document.getElementById('responseStatus'),
    responseTime: document.getElementById('responseTime'),
    jsonConsole: document.getElementById('jsonConsole'),
    
    // Simulators
    simTabs: document.querySelectorAll('.sim-tab-btn'),
    simPanes: document.querySelectorAll('.sim-content-pane'),
    renderedNotiCount: document.getElementById('renderedNotiCount'),
    renderedNotificationList: document.getElementById('renderedNotificationList'),
    
    // Phone Simulator Views
    phoneTime: document.getElementById('phoneTime'),
    lockscreenTime: document.getElementById('lockscreenTime'),
    lockscreenDate: document.getElementById('lockscreenDate'),
    phoneLockScreen: document.getElementById('phoneLockScreen'),
    phoneSmsScreen: document.getElementById('phoneSmsScreen'),
    phonePushBannerContainer: document.getElementById('phonePushBannerContainer'),
    smsConversationBody: document.getElementById('smsConversationBody'),
    closeSmsView: document.getElementById('closeSmsView'),
    
    // Gmail Simulator Views
    gmailBadge: document.getElementById('gmailBadge'),
    gmailMailRows: document.getElementById('gmailMailRows'),
    gmailMailDetailView: document.getElementById('gmailMailDetailView'),
    closeGmailMail: document.getElementById('closeGmailMail'),
    gmailSubject: document.getElementById('gmailSubject'),
    gmailSenderName: document.getElementById('gmailSenderName'),
    gmailSenderEmail: document.getElementById('gmailSenderEmail'),
    gmailDate: document.getElementById('gmailDate'),
    gmailBody: document.getElementById('gmailBody')
  };
}

// Populate saved config into UI
function loadSettingsToUI() {
  el.apiHostInput.value = state.settings.apiHost;
  el.overrideListPath.value = state.settings.pathList;
  el.overrideReadPath.value = state.settings.pathRead;
  el.overrideReadAllPath.value = state.settings.pathReadAll;
  el.overrideCreatePath.value = state.settings.pathCreate;
}

// Update Mock Mode UI State
function updateMockModeUI() {
  if (state.isMockMode) {
    el.mockModeToggle.classList.remove('bg-slate-700');
    el.mockModeToggle.classList.add('bg-emerald-600');
    el.mockModeSlider.classList.remove('translate-x-0');
    el.mockModeSlider.classList.add('translate-x-5');
    el.statusIndicator.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50';
  } else {
    el.mockModeToggle.classList.remove('bg-emerald-600');
    el.mockModeToggle.classList.add('bg-slate-700');
    el.mockModeSlider.classList.remove('translate-x-5');
    el.mockModeSlider.classList.add('translate-x-0');
    el.statusIndicator.className = 'w-2.5 h-2.5 rounded-full bg-blue-500 shadow-md shadow-blue-500/50';
  }
}

// Clock widget on lock screen
function updateTimeWidgets() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString('en-US', options);
  
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  if (el.phoneTime) el.phoneTime.textContent = timeStr;
  if (el.lockscreenTime) el.lockscreenTime.textContent = timeStr;
  if (el.lockscreenDate) el.lockscreenDate.textContent = dateStr;
}

// Event Bindings
function bindEvents() {
  // Mock Mode Switch
  el.mockModeToggle.addEventListener('click', () => {
    state.saveMockMode(!state.isMockMode);
    updateMockModeUI();
    logConsoleMessage(`// Mode changed: ${state.isMockMode ? 'Mock Server Enabled (Intercepts API requests)' : 'Live API Server (Makes real fetch calls)'}`);
  });

  // Settings Save
  el.saveSettingsBtn.addEventListener('click', () => {
    state.saveSettings({
      apiHost: el.apiHostInput.value.trim(),
      pathList: el.overrideListPath.value.trim(),
      pathRead: el.overrideReadPath.value.trim(),
      pathReadAll: el.overrideReadAllPath.value.trim(),
      pathCreate: el.overrideCreatePath.value.trim()
    });
    alert('Đã lưu cấu hình API link vào localStorage!');
    logConsoleMessage('// Đã lưu cấu hình liên kết API.');
  });

  // API Tester Left Tabs Switcher
  el.apiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      el.apiTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetContent = tab.getAttribute('data-tab');
      el.apiTabContents.forEach(content => {
        if (content.id === targetContent) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // Live Simulator Right Tabs Switcher
  el.simTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      el.simTabs.forEach(t => {
        t.classList.remove('bg-slate-800', 'text-slate-200');
        t.classList.add('text-slate-400', 'hover:text-slate-200');
      });
      tab.classList.remove('text-slate-400', 'hover:text-slate-200');
      tab.classList.add('bg-slate-800', 'text-slate-200');

      const targetPane = tab.getAttribute('data-sim-tab');
      state.activeSimTab = targetPane;
      el.simPanes.forEach(pane => {
        if (pane.id === targetPane) {
          pane.classList.remove('hidden');
        } else {
          pane.classList.add('hidden');
        }
      });
    });
  });

  // Header System Bell Dropdown toggling
  el.bellButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = el.bellDropdown;
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
      setTimeout(() => {
        dropdown.classList.remove('opacity-0', 'scale-95');
        dropdown.classList.add('opacity-100', 'scale-100');
      }, 10);
    } else {
      closeBellDropdown();
    }
  });

  document.addEventListener('click', () => {
    closeBellDropdown();
  });

  el.bellDropdown.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent closing when clicking inside
  });

  el.clearSystemNotifications.addEventListener('click', () => {
    if (state.isMockMode) {
      state.mockDb = state.mockDb.filter(n => n.type !== 'SYSTEM');
      state.saveMockDb();
      refreshSimulatorUI();
      logConsoleMessage('// Đã xóa tất cả thông báo SYSTEM của mock db.');
    } else {
      alert('Chức năng clear chỉ hoạt động ở Mock Mode hoặc bạn phải tự xóa qua API.');
    }
  });

  // SMS close view (returns to Lockscreen layout inside phone mockup)
  el.closeSmsView.addEventListener('click', () => {
    el.phoneSmsScreen.classList.add('opacity-0', 'pointer-events-none');
    el.phoneLockScreen.classList.remove('opacity-0', 'pointer-events-none');
  });

  // Gmail email detail close
  el.closeGmailMail.addEventListener('click', () => {
    el.gmailMailDetailView.classList.add('translate-x-full');
  });

  // Templates buttons for Payload Editor
  el.payloadTemplateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const templateName = btn.getAttribute('data-template');
      loadTemplate(templateName);
    });
  });

  // SEND Request Handlers
  el.sendListRequestBtn.addEventListener('click', handleGetList);
  el.sendReadRequestBtn.addEventListener('click', handleReadNotification);
  el.sendReadAllRequestBtn.addEventListener('click', handleReadAllNotifications);
  el.sendCreateRequestBtn.addEventListener('click', handleCreateNotification);
}

// Close Header Bell Dropdown Helper
function closeBellDropdown() {
  const dropdown = el.bellDropdown;
  dropdown.classList.remove('opacity-100', 'scale-100');
  dropdown.classList.add('opacity-0', 'scale-95');
  setTimeout(() => {
    dropdown.classList.add('hidden');
  }, 200);
}

// JSON syntax highlighter for developer responses
function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return '<span class="json-' + cls + '">' + match + '</span>';
  });
}

// Log message directly to console
function logConsoleMessage(rawString) {
  el.jsonConsole.innerHTML = rawString;
}

// Update HTTP response console information
function updateConsoleResponseMeta(status, time, data) {
  el.responseStatus.textContent = `Status: ${status}`;
  el.responseTime.textContent = `Time: ${time} ms`;
  el.jsonConsole.innerHTML = syntaxHighlight(data);
}

// Load JSON template helper
function loadTemplate(type) {
  let templateObj = {};
  if (type === 'SYSTEM') {
    templateObj = {
      title: "Bảo trì hệ thống CORE-API",
      content: "Hệ thống CORE-API sẽ bảo trì cập nhật cơ sở dữ liệu định kỳ vào lúc 02:00 sáng. Thời gian gián đoạn dự kiến 15 phút.",
      type: "SYSTEM",
      channel: "SYSTEM",
      isRead: false
    };
  } else if (type === 'SMS') {
    templateObj = {
      title: "OTP TRANSACTION",
      content: "Ma OTP xac thuc rut tien tai khoan *9821 cua ban la 619208. Hieu luc trong 3 phut. Khong tiet lo ma nay cho bat ky ai.",
      type: "SMS",
      channel: "SMS",
      isRead: false
    };
  } else if (type === 'EMAIL') {
    templateObj = {
      title: "Cập nhật chính sách dịch vụ người dùng 2026",
      content: "Xin chào khách hàng, chúng tôi vừa tiến hành cập nhật điều khoản sử dụng và chính sách bảo mật dữ liệu khách hàng. Vui lòng đọc kỹ các thay đổi về quyền riêng tư và đồng ý để tiếp tục sử dụng dịch vụ.",
      type: "EMAIL",
      channel: "EMAIL",
      isRead: false
    };
  } else if (type === 'PUSH') {
    templateObj = {
      title: "Khuyến mãi cực hời chỉ trong tối nay!",
      content: "Grab tặng bạn ưu đãi 50% toàn bộ dịch vụ ăn uống và di chuyển từ 18:00 - 22:00. Đặt lịch ngay kẻo lỡ!",
      type: "PUSH",
      channel: "PUSH",
      isRead: false
    };
  }
  el.createPayload.value = JSON.stringify(templateObj, null, 2);
}

// ==========================================
// API ACTION REQUEST HANDLERS
// ==========================================

// 1. GET LIST NOTIFICATION
async function handleGetList() {
  const page = parseInt(el.paramPage.value) || 1;
  const limit = parseInt(el.paramLimit.value) || 10;
  const path = el.overrideListPath.value.trim() || DEFAULTS.pathList;
  const fullUrl = `${el.apiHostInput.value.trim()}${path}?page=${page}&limit=${limit}`;

  logConsoleMessage(`// Sending GET request to: ${fullUrl}...`);
  const startTime = performance.now();

  if (state.isMockMode) {
    // Mock simulation delay
    await sleep(400);
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + limit;
    const paginatedItems = state.mockDb.slice(startIdx, endIdx);
    
    const mockResponse = {
      success: true,
      data: paginatedItems,
      pagination: {
        page: page,
        limit: limit,
        total: state.mockDb.length
      }
    };
    
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    updateConsoleResponseMeta(200, duration, mockResponse);
    renderNotificationCards(mockResponse.data);
    refreshSimulatorUI();
  } else {
    // Real API Call
    try {
      const response = await fetch(fullUrl, { method: 'GET' });
      const duration = Math.round(performance.now() - startTime);
      const json = await response.json();
      updateConsoleResponseMeta(response.status, duration, json);
      
      // Auto-extract notifications array from response
      const extractedList = extractListFromJson(json);
      renderNotificationCards(extractedList);
      refreshSimulatorUI();
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      updateConsoleResponseMeta('Error', duration, { error: error.message });
    }
  }
}

// Helper to extract notification array from dynamic API JSON schemas
function extractListFromJson(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === 'object') {
    // check popular fields
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.notifications)) return json.notifications;
    if (Array.isArray(json.items)) return json.items;
    
    // search recursively for any array
    for (let key in json) {
      if (Array.isArray(json[key])) {
        return json[key];
      }
    }
  }
  return [];
}

// 2. READ NOTIFICATION (ONE ID)
async function handleReadNotification() {
  const id = el.readNotiId.value.trim();
  if (!id) {
    alert('Vui lòng nhập ID thông báo!');
    return;
  }

  const pathPattern = el.overrideReadPath.value.trim() || DEFAULTS.pathRead;
  const path = pathPattern.replace('{id}', id);
  const fullUrl = `${el.apiHostInput.value.trim()}${path}`;

  logConsoleMessage(`// Sending POST request to: ${fullUrl}...`);
  const startTime = performance.now();

  if (state.isMockMode) {
    await sleep(350);
    const success = state.readMockNotification(id);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    if (success) {
      const mockResponse = { success: true, message: `Notification ${id} marked as read.` };
      updateConsoleResponseMeta(200, duration, mockResponse);
      refreshSimulatorUI();
      // update the rendered list in view if it exists
      handleGetList();
    } else {
      const mockResponse = { success: false, message: `Notification ${id} not found.` };
      updateConsoleResponseMeta(404, duration, mockResponse);
    }
  } else {
    // Real API Call
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const duration = Math.round(performance.now() - startTime);
      const json = await response.json();
      updateConsoleResponseMeta(response.status, duration, json);
      refreshSimulatorUI();
      handleGetList(); // refresh active view list
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      updateConsoleResponseMeta('Error', duration, { error: error.message });
    }
  }
}

// 3. READ ALL NOTIFICATIONS
async function handleReadAllNotifications() {
  const path = el.overrideReadAllPath.value.trim() || DEFAULTS.pathReadAll;
  const fullUrl = `${el.apiHostInput.value.trim()}${path}`;

  logConsoleMessage(`// Sending POST request to: ${fullUrl}...`);
  const startTime = performance.now();

  if (state.isMockMode) {
    await sleep(400);
    state.readAllMockNotifications();
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    const mockResponse = { success: true, message: "All notifications marked as read." };
    updateConsoleResponseMeta(200, duration, mockResponse);
    refreshSimulatorUI();
    handleGetList(); // refresh active view list
  } else {
    // Real API Call
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const duration = Math.round(performance.now() - startTime);
      const json = await response.json();
      updateConsoleResponseMeta(response.status, duration, json);
      refreshSimulatorUI();
      handleGetList();
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      updateConsoleResponseMeta('Error', duration, { error: error.message });
    }
  }
}

// 4. CREATE NOTIFICATION
async function handleCreateNotification() {
  const payloadStr = el.createPayload.value.trim();
  let parsedPayload;
  
  try {
    parsedPayload = JSON.parse(payloadStr);
  } catch (err) {
    alert('JSON Payload không hợp lệ. Vui lòng định dạng đúng JSON!');
    return;
  }

  const path = el.overrideCreatePath.value.trim() || DEFAULTS.pathCreate;
  const fullUrl = `${el.apiHostInput.value.trim()}${path}`;

  logConsoleMessage(`// Sending POST request to create notification: ${fullUrl}...`);
  const startTime = performance.now();

  if (state.isMockMode) {
    await sleep(500);
    const createdNoti = state.addMockNotification(parsedPayload);
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    updateConsoleResponseMeta(201, duration, createdNoti);
    triggerVisualSimulation(createdNoti);
    refreshSimulatorUI();
    // update list
    handleGetList();
  } else {
    // Real API Call
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedPayload)
      });
      const duration = Math.round(performance.now() - startTime);
      const json = await response.json();
      updateConsoleResponseMeta(response.status, duration, json);
      
      // Attempt to trigger visual simulation from parsed response object
      if (json && typeof json === 'object') {
        const notiObj = json.data || json; // standard patterns
        triggerVisualSimulation(notiObj);
      }
      refreshSimulatorUI();
      handleGetList();
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      updateConsoleResponseMeta('Error', duration, { error: error.message });
    }
  }
}

// ==========================================
// RENDERERS & LIVE SIMULATOR EVENT HANDLERS
// ==========================================

// Render list notifications in GET LIST card layout on the right
function renderNotificationCards(notifications) {
  el.renderedNotificationList.innerHTML = '';
  
  if (!notifications || notifications.length === 0) {
    el.renderedNotiCount.textContent = '0';
    el.renderedNotificationList.innerHTML = `
      <div class="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-500 text-sm">
        Không tìm thấy thông báo nào.
      </div>
    `;
    return;
  }

  el.renderedNotiCount.textContent = notifications.length;

  notifications.forEach(item => {
    // check required properties, fallbacks
    const title = item.title || 'Không có tiêu đề';
    const content = item.content || 'Không có nội dung';
    const channel = (item.channel || item.type || 'SYSTEM').toUpperCase();
    const isRead = item.isRead === true || item.isRead === 'true' || item.isRead === 1;
    const id = item.id || item._id || 'N/A';
    
    const card = document.createElement('div');
    card.className = `noti-card-item bg-slate-900 border border-slate-800/60 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 channel-${channel}`;
    
    // Left Content Column
    const leftCol = document.createElement('div');
    leftCol.className = 'flex-1 space-y-1.5';
    
    const titleRow = document.createElement('div');
    titleRow.className = 'flex items-center space-x-2';
    
    // Unread Red Dot
    if (!isRead) {
      const redDot = document.createElement('span');
      redDot.className = 'w-2 h-2 rounded-full bg-rose-500 pulse-dot flex-shrink-0';
      titleRow.appendChild(redDot);
    }
    
    const titleEl = document.createElement('h4');
    titleEl.className = `text-sm font-semibold text-slate-100 ${!isRead ? 'font-bold' : ''}`;
    titleEl.textContent = title;
    titleRow.appendChild(titleEl);
    leftCol.appendChild(titleRow);
    
    // Content details
    const contentEl = document.createElement('p');
    contentEl.className = 'text-xs text-slate-400 line-clamp-2 leading-relaxed';
    contentEl.textContent = content;
    leftCol.appendChild(contentEl);
    
    // Meta tag badge values
    const metaRow = document.createElement('div');
    metaRow.className = 'flex items-center space-x-2 text-[10px] text-slate-500';
    
    const idLabel = document.createElement('span');
    idLabel.className = 'font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/50';
    idLabel.textContent = `ID: ${id}`;
    metaRow.appendChild(idLabel);
    
    const channelBadge = document.createElement('span');
    channelBadge.className = `px-2 py-0.5 rounded font-bold ${getChannelBadgeStyle(channel)}`;
    channelBadge.textContent = channel;
    metaRow.appendChild(channelBadge);
    
    if (item.createdAt) {
      const timeLabel = document.createElement('span');
      timeLabel.textContent = formatRelativeTime(item.createdAt);
      metaRow.appendChild(timeLabel);
    }
    
    leftCol.appendChild(metaRow);
    card.appendChild(leftCol);
    
    // Right Action Column
    const rightCol = document.createElement('div');
    rightCol.className = 'flex items-center space-x-2 shrink-0 self-end md:self-auto';
    
    if (!isRead) {
      const readBtn = document.createElement('button');
      readBtn.className = 'bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition flex items-center space-x-1';
      readBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Đọc</span>
      `;
      readBtn.addEventListener('click', () => {
        // Auto-switch to read tab, set value, trigger send
        el.readNotiId.value = id;
        // switch tab
        document.querySelector('[data-tab="tab-read"]').click();
        // send request
        handleReadNotification();
      });
      rightCol.appendChild(readBtn);
    } else {
      const readStatus = document.createElement('span');
      readStatus.className = 'text-[11px] text-slate-500 font-semibold italic px-3';
      readStatus.textContent = 'Đã đọc';
      rightCol.appendChild(readStatus);
    }
    
    card.appendChild(rightCol);
    el.renderedNotificationList.appendChild(card);
  });
}

// Get Tailind CSS styling colors for channel meta tag badge
function getChannelBadgeStyle(channel) {
  switch (channel) {
    case 'SYSTEM': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    case 'EMAIL': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'SMS': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    case 'PUSH': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  }
}

// Dynamic simulator update based on mock state or real lists
function refreshSimulatorUI() {
  // Read notifications from local mock db
  const notis = state.mockDb;
  
  // 1. Update SYSTEM Dropdown Menu
  const systemNotis = notis.filter(n => n.type === 'SYSTEM' || n.channel === 'SYSTEM');
  const unreadSystem = systemNotis.filter(n => !n.isRead);
  
  // Update Bell Badge
  if (unreadSystem.length > 0) {
    el.bellBadge.classList.remove('hidden');
    el.bellBadge.textContent = unreadSystem.length > 99 ? '99+' : unreadSystem.length;
  } else {
    el.bellBadge.classList.add('hidden');
  }

  // Render System dropdown content
  el.systemDropdownList.innerHTML = '';
  if (systemNotis.length === 0) {
    el.systemDropdownList.innerHTML = `
      <div class="px-4 py-6 text-center text-slate-500 text-xs">
        Chưa có thông báo hệ thống nào.
      </div>
    `;
  } else {
    systemNotis.forEach(noti => {
      const item = document.createElement('div');
      item.className = `p-3.5 hover:bg-slate-800/40 transition cursor-pointer flex items-start space-x-3 ${!noti.isRead ? 'bg-slate-800/20' : ''}`;
      
      const unreadMarker = !noti.isRead 
        ? `<span class="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0 mt-1.5"></span>` 
        : `<span class="w-1.5 h-1.5 bg-transparent rounded-full flex-shrink-0 mt-1.5"></span>`;

      item.innerHTML = `
        ${unreadMarker}
        <div class="flex-1 space-y-0.5">
          <div class="flex items-center justify-between">
            <h5 class="text-xs font-bold text-slate-200">${noti.title}</h5>
            <span class="text-[9px] text-slate-500">${formatRelativeTime(noti.createdAt)}</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">${noti.content}</p>
        </div>
      `;

      item.addEventListener('click', () => {
        if (!noti.isRead) {
          if (state.isMockMode) {
            state.readMockNotification(noti.id);
            refreshSimulatorUI();
            handleGetList();
          } else {
            // Fill ID field and switch tab for user to execute
            el.readNotiId.value = noti.id;
            document.querySelector('[data-tab="tab-read"]').click();
          }
        }
      });
      el.systemDropdownList.appendChild(item);
    });
  }

  // 2. Update PHONE SMS Conversation App
  const smsNotis = notis.filter(n => n.type === 'SMS' || n.channel === 'SMS');
  // Render SMS chat history backwards (oldest to newest for scroll conversation flow)
  el.smsConversationBody.innerHTML = '';
  
  // Default system guide msg
  const welcomeSms = document.createElement('div');
  welcomeSms.className = 'sms-bubble received max-w-[85%] bg-slate-900 border border-slate-800/50 p-3 rounded-2xl rounded-tl-none text-slate-300 text-xs self-start leading-relaxed';
  welcomeSms.textContent = 'Chào mừng đến với trình mô phỏng SMS! Các tin nhắn được gửi từ API thông báo kênh SMS sẽ hiển thị ngay tại đây.';
  el.smsConversationBody.appendChild(welcomeSms);

  const reversedSms = [...smsNotis].reverse();
  reversedSms.forEach(noti => {
    const bubble = document.createElement('div');
    bubble.className = `sms-bubble received max-w-[85%] bg-slate-900 border border-slate-800 p-3 rounded-2xl rounded-tl-none text-slate-300 text-xs self-start space-y-1.5 leading-relaxed`;
    bubble.innerHTML = `
      <div class="font-bold text-[10px] text-amber-500 uppercase tracking-wide">${noti.title}</div>
      <div>${noti.content}</div>
      <div class="text-[8px] text-slate-500 text-right mt-1">${new Date(noti.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    el.smsConversationBody.appendChild(bubble);
  });
  
  // auto-scroll
  setTimeout(() => {
    el.smsConversationBody.scrollTop = el.smsConversationBody.scrollHeight;
  }, 10);

  // 3. Update GMAIL Inbox List View
  const emailNotis = notis.filter(n => n.type === 'EMAIL' || n.channel === 'EMAIL');
  const unreadEmails = emailNotis.filter(n => !n.isRead);

  // Update sidebar badge
  if (unreadEmails.length > 0) {
    el.gmailBadge.classList.remove('hidden');
    el.gmailBadge.textContent = unreadEmails.length;
  } else {
    el.gmailBadge.classList.add('hidden');
  }

  el.gmailMailRows.innerHTML = '';
  if (emailNotis.length === 0) {
    el.gmailMailRows.innerHTML = `
      <div class="px-4 py-12 text-center text-slate-500 text-xs">
        Không có thư nào trong hộp thư đến. Gửi một EMAIL notification để hiển thị ở đây.
      </div>
    `;
  } else {
    emailNotis.forEach(noti => {
      const row = document.createElement('div');
      row.className = `px-4 py-3 flex items-center justify-between border-b border-slate-800/80 cursor-pointer hover:bg-slate-900/50 transition duration-150 ${!noti.isRead ? 'gmail-row-unread bg-slate-900/20' : 'gmail-row-read'}`;
      
      const starIcon = `<svg class="w-4 h-4 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>`;
      
      row.innerHTML = `
        <div class="flex items-center space-x-3 flex-1 min-w-0">
          <input type="checkbox" disabled class="rounded border-slate-800 bg-slate-950 text-rose-600">
          ${starIcon}
          <div class="text-xs text-rose-400 font-bold w-36 truncate flex-shrink-0">Service Dispatcher</div>
          <div class="flex-1 truncate text-xs min-w-0 flex items-baseline space-x-2">
            <span class="text-slate-200 font-semibold flex-shrink-0">${noti.title}</span>
            <span class="text-slate-500 font-normal truncate">- ${noti.content}</span>
          </div>
        </div>
        <div class="text-[10px] text-slate-500 font-medium ml-4 shrink-0">
          ${new Date(noti.createdAt).toLocaleDateString('vi-VN', {month: 'numeric', day: 'numeric'})}
        </div>
      `;

      row.addEventListener('click', () => {
        // Open Mail Detail Viewer
        openGmailEmailDetail(noti);
        
        // Mark as read in mock db if active
        if (!noti.isRead && state.isMockMode) {
          state.readMockNotification(noti.id);
          refreshSimulatorUI();
          handleGetList();
        }
      });
      el.gmailMailRows.appendChild(row);
    });
  }
}

// Gmail detail view opener
function openGmailEmailDetail(noti) {
  el.gmailSubject.textContent = noti.title;
  el.gmailSenderName.textContent = "Notification Service dispatcher";
  el.gmailSenderEmail.textContent = `<service-noreply@api-simulator.net>`;
  el.gmailBody.textContent = noti.content;
  
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  el.gmailDate.textContent = new Date(noti.createdAt).toLocaleDateString('vi-VN', options);
  
  el.gmailMailDetailView.classList.remove('translate-x-full');
}

// ==========================================
// TRIGGER VISUAL EVENTS SIMULATION
// ==========================================
function triggerVisualSimulation(noti) {
  if (!noti) return;
  const channel = (noti.channel || noti.type || 'SYSTEM').toUpperCase();

  switch (channel) {
    case 'SYSTEM':
      // Switch simulator tab to UI List view
      document.querySelector('[data-sim-tab="sim-list"]').click();
      
      // Trigger Bell shaking effect
      const bell = el.bellSvg;
      bell.classList.add('shake-bell');
      setTimeout(() => {
        bell.classList.remove('shake-bell');
      }, 600);
      
      // Open bell dropdown to draw attention to system alert
      setTimeout(() => {
        el.bellButton.click();
      }, 500);
      break;

    case 'SMS':
      // Switch simulator tab to Phone Mockup
      document.querySelector('[data-sim-tab="sim-phone"]').click();
      
      // Open SMS conversation view inside iPhone
      el.phoneLockScreen.classList.add('opacity-0', 'pointer-events-none');
      el.phoneSmsScreen.classList.remove('opacity-0', 'pointer-events-none');
      break;

    case 'EMAIL':
      // Switch simulator tab to Gmail Mockup
      document.querySelector('[data-sim-tab="sim-gmail"]').click();
      
      // Close detail view if open to show the new email in inbox
      el.gmailMailDetailView.classList.add('translate-x-full');
      break;

    case 'PUSH':
      // Switch simulator tab to Phone Mockup
      document.querySelector('[data-sim-tab="sim-phone"]').click();
      
      // Return to lockscreen view to show Push Banner sliding
      el.phoneSmsScreen.classList.add('opacity-0', 'pointer-events-none');
      el.phoneLockScreen.classList.remove('opacity-0', 'pointer-events-none');
      
      // Slide Down Banner
      createMobilePushNotificationBanner(noti.title, noti.content);
      break;
  }
}

// Generate Push Notification Banner DOM inside iPhone Lockscreen
function createMobilePushNotificationBanner(title, content) {
  const container = el.phonePushBannerContainer;
  
  const banner = document.createElement('div');
  banner.className = 'push-notification-banner w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3.5 shadow-xl flex items-start space-x-3 text-left relative overflow-hidden select-none';
  
  banner.innerHTML = `
    <!-- App icon indicator -->
    <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-indigo-500/20">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </div>
    
    <!-- Text body details -->
    <div class="flex-1 min-w-0 space-y-0.5">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">SYSTEM ALERT</span>
        <span class="text-[9px] text-slate-500">bây giờ</span>
      </div>
      <h5 class="text-xs font-bold text-slate-100 truncate">${title}</h5>
      <p class="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">${content}</p>
    </div>
  `;

  // Prepend to show newer pushes at top
  container.insertBefore(banner, container.firstChild);

  // Auto clean up from DOM after animation completes (5 seconds)
  setTimeout(() => {
    banner.remove();
  }, 5000);
}

// ==========================================
// UTILITIES
// ==========================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Pretty relative time format converter (like '2 phút trước')
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  
  if (diffSec < 60) return 'vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHr < 24) return `${diffHr} giờ trước`;
  
  return date.toLocaleDateString('vi-VN', {month: 'numeric', day: 'numeric'});
}
