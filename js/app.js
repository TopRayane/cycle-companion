document.addEventListener("DOMContentLoaded", () => {
  UI.cacheEls();

  const user = Storage.get().user;

  // ========== صفحه خوش‌آمد ==========
  const welcomeScreen = document.getElementById("welcome-screen");
  const appScreen = document.getElementById("app-screen");
  const nameInput = document.getElementById("name-input");
  const startBtn = document.getElementById("start-btn");

  if (user.name) {
    welcomeScreen.classList.remove("active");
    appScreen.classList.add("active");
    UI.renderAll();
  }

  startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.style.borderColor = "#e88";
      nameInput.placeholder = "لطفاً اسمت رو بنویس...";
      return;
    }
    Storage.setUser({ name });
    welcomeScreen.classList.remove("active");
    appScreen.classList.add("active");
    UI.renderAll();
  });

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startBtn.click();
  });

  // ========== فرم ثبت دوره ==========
  UI.els.periodForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const start = UI.els.startDate.value;
    const end = UI.els.endDate.value;
    if (!start || !end) return;
    try {
      Storage.addPeriod(start, end);
      UI.els.periodForm.reset();
      UI.renderAll();
    } catch (err) {
      alert(err.message);
    }
  });

  // ========== یادداشت ==========
  UI.els.saveNoteBtn.addEventListener("click", () => {
    Storage.addNote(UI.els.noteInput.value);
    UI.els.noteInput.value = "";
    UI.renderNotes();
  });

  // ========== چت ==========
  UI.els.navChat.addEventListener("click", () => UI.openChat("chat"));
  UI.els.navCompanion.addEventListener("click", () => UI.openChat("companion"));
  UI.els.closeChat.addEventListener("click", () => UI.closeChat());

  UI.els.sendChat.addEventListener("click", sendChatHandler);
  UI.els.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendChatHandler();
  });

  function sendChatHandler() {
    const text = UI.els.chatInput.value.trim();
    if (!text) return;
    UI.els.chatInput.value = "";
    Chat.sendMessage(text);
  }

  // ========== ناوبری ==========
  UI.els.navHome.addEventListener("click", () => {
    UI.closeChat();
    setActiveNav(UI.els.navHome);
  });

  function setActiveNav(btn) {
    [UI.els.navHome, UI.els.navChat, UI.els.navCompanion].forEach((b) =>
      b.classList.remove("active")
    );
    btn.classList.add("active");
  }

  // ========== تنظیمات ==========
  document.getElementById("settings-btn").addEventListener("click", () => UI.openSettings());
  UI.els.closeSettings.addEventListener("click", () => UI.closeSettings());

  UI.els.saveSettings.addEventListener("click", () => {
    const name = UI.els.settingsName.value.trim();
    const cycleLength = parseInt(UI.els.settingsCycleLength.value, 10);
    const periodLength = parseInt(UI.els.settingsPeriodLength.value, 10);
    if (!name) {
      alert("نام نمی‌تونه خالی باشه");
      return;
    }
    Storage.setUser({ name, cycleLength, periodLength });
    UI.closeSettings();
    UI.renderAll();
  });

  UI.els.resetApp.addEventListener("click", () => {
    if (confirm("همه‌ی داده‌ها پاک بشن؟ این کار برگشت‌پذیر نیست.")) {
      Storage.clearAll();
      location.reload();
    }
  });

  // ========== ثبت PWA ==========
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.warn("Service Worker ثبت نشد:", err);
    });
  }
});
