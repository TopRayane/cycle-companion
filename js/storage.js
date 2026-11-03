const Storage = (() => {
  const KEY = APP_CONFIG.STORAGE_KEY;

  function _load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : _defaults();
    } catch {
      return _defaults();
    }
  }

  function _save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("localStorage در دسترس نیست:", e);
    }
  }

  function _defaults() {
    return {
      user: { name: "", cycleLength: 28, periodLength: 5 },
      periods: [],
      notes: [],
      symptoms: {},
      chatHistory: [],
      companionHistory: [],
    };
  }

  let _data = _load();

  function get() {
    return _data;
  }

  function save() {
    _save(_data);
  }

  // --- کاربر ---
  function setUser(patch) {
    Object.assign(_data.user, patch);
    save();
  }

  // --- دوره‌ها ---
  function addPeriod(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) throw new Error("تاریخ پایان نمی‌تونه قبل از شروع باشه");

    _data.periods.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
      start,
      end,
      createdAt: new Date().toISOString(),
    });
    _data.periods.sort((a, b) => new Date(b.start) - new Date(a.start));
    save();
  }

  function getPeriods() {
    return [..._data.periods].sort((a, b) => new Date(b.start) - new Date(a.start));
  }

  function getLastPeriod() {
    return getPeriods()[0] || null;
  }

  // --- یادداشت‌ها ---
  function addNote(text) {
    if (!text.trim()) return;
    _data.notes.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
      text: text.trim(),
      date: new Date().toISOString(),
    });
    save();
  }

  function getNotes() {
    return _data.notes;
  }

  // --- علائم ---
  function setSymptom(id, value) {
    _data.symptoms[id] = value;
    save();
  }

  function getSymptoms() {
    return _data.symptoms;
  }

  // --- چت ---
  function addChatMessage(role, content, mode = "chat") {
    const key = mode === "companion" ? "companionHistory" : "chatHistory";
    _data[key].push({ role, content });
    if (_data[key].length > 40) _data[key] = _data[key].slice(-40);
    save();
  }

  function getChatHistory(mode = "chat") {
    return mode === "companion" ? _data.companionHistory : _data.chatHistory;
  }

  function clearAll() {
    _data = _defaults();
    save();
  }

  return {
    get,
    save,
    setUser,
    addPeriod,
    getPeriods,
    getLastPeriod,
    addNote,
    getNotes,
    setSymptom,
    getSymptoms,
    addChatMessage,
    getChatHistory,
    clearAll,
  };
})();
