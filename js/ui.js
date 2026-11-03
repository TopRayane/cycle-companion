const UI = (() => {
  const els = {};
  let chatMode = "chat"; // "chat" | "companion"

  function cacheEls() {
    els.greeting = document.getElementById("greeting");
    els.userNameDisplay = document.getElementById("user-name-display");
    els.phaseLabel = document.getElementById("phase-label");
    els.cycleRing = document.getElementById("cycle-ring");
    els.cycleDay = document.getElementById("cycle-day");
    els.nextPeriodDate = document.getElementById("next-period-date");
    els.fertilityWindow = document.getElementById("fertility-window");
    els.periodForm = document.getElementById("period-form");
    els.startDate = document.getElementById("start-date");
    els.endDate = document.getElementById("end-date");
    els.symptomGrid = document.getElementById("symptom-grid");
    els.noteInput = document.getElementById("note-input");
    els.saveNoteBtn = document.getElementById("save-note-btn");
    els.noteList = document.getElementById("note-list");
    els.tipsContainer = document.getElementById("tips-container");
    els.historyList = document.getElementById("history-list");
    els.chatPanel = document.getElementById("chat-panel");
    els.chatTitle = document.getElementById("chat-title");
    els.chatMessages = document.getElementById("chat-messages");
    els.chatInput = document.getElementById("chat-input");
    els.sendChat = document.getElementById("send-chat");
    els.closeChat = document.getElementById("close-chat");
    els.settingsPanel = document.getElementById("settings-panel");
    els.closeSettings = document.getElementById("close-settings");
    els.settingsName = document.getElementById("settings-name");
    els.settingsCycleLength = document.getElementById("settings-cycle-length");
    els.settingsPeriodLength = document.getElementById("settings-period-length");
    els.saveSettings = document.getElementById("save-settings");
    els.resetApp = document.getElementById("reset-app");
    els.navHome = document.getElementById("nav-home");
    els.navChat = document.getElementById("nav-chat");
    els.navCompanion = document.getElementById("nav-companion");
  }

  function renderAll() {
    renderHeader();
    renderCycleRing();
    renderPredictions();
    renderSymptoms();
    renderNotes();
    renderTips();
    renderHistory();
  }

  function renderHeader() {
    const name = Storage.get().user.name || "رفیق";
    els.greeting.textContent = `سلام ${name} 🌸`;
    els.userNameDisplay.textContent = name;

    const cycleDay = Cycle.getCurrentCycleDay();
    const phase = Cycle.getPhase(cycleDay);
    const phaseNames = {
      menstrual: "دوره قاعدگی",
      follicular: "فاز فولیکولی",
      ovulatory: "تخمک‌گذاری",
      luteal: "فاز لوتئال",
      unknown: "ثبت اولین دوره",
    };
    els.phaseLabel.textContent = phaseNames[phase] || "در حال محاسبه...";
  }

  function renderCycleRing() {
    const cycleDay = Cycle.getCurrentCycleDay();
    const cycleLen = Cycle.getCycleLength();
    const svg = els.cycleRing;
    svg.innerHTML = "";

    const cx = 100, cy = 100, r = 80, stroke = 14;
    const circumference = 2 * Math.PI * r;

    // پس‌زمینه
    const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    bgCircle.setAttribute("cx", cx);
    bgCircle.setAttribute("cy", cy);
    bgCircle.setAttribute("r", r);
    bgCircle.setAttribute("fill", "none");
    bgCircle.setAttribute("stroke", "#f0e4ea");
    bgCircle.setAttribute("stroke-width", stroke);
    svg.appendChild(bgCircle);

    // پیشرفت
    const progress = cycleDay ? Math.min(cycleDay / cycleLen, 1) : 0;
    const dashArray = circumference;
    const dashOffset = circumference * (1 - progress);

    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.setAttribute("cx", cx);
    progressCircle.setAttribute("cy", cy);
    progressCircle.setAttribute("r", r);
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke", "url(#gradient)");
    progressCircle.setAttribute("stroke-width", stroke);
    progressCircle.setAttribute("stroke-linecap", "round");
    progressCircle.setAttribute("stroke-dasharray", dashArray);
    progressCircle.setAttribute("stroke-dashoffset", dashOffset);
    svg.appendChild(progressCircle);

    // گرادیانت
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", "gradient");
    grad.setAttribute("x1", "0%");
    grad.setAttribute("y1", "0%");
    grad.setAttribute("x2", "100%");
    grad.setAttribute("y2", "100%");
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#e8a0bf");
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#d8c4e8");
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.appendChild(defs);

    els.cycleDay.textContent = cycleDay || "—";
  }

  function renderPredictions() {
    const next = Cycle.predictNextPeriod();
    els.nextPeriodDate.textContent = next ? Cycle.formatDateFA(next) : "ثبت کن";

    const fw = Cycle.getFertilityWindow();
    els.fertilityWindow.textContent = fw
      ? `${Cycle.formatDateFA(fw.start)} - ${Cycle.formatDateFA(fw.end)}`
      : "—";
  }

  function renderSymptoms() {
    const current = Storage.getSymptoms();
    els.symptomGrid.innerHTML = "";
    APP_CONFIG.SYMPTOMS.forEach((s) => {
      const row = document.createElement("div");
      row.className = "symptom-row";
      row.innerHTML = `
        <span class="symptom-label">${s.emoji} ${s.label}</span>
        <div class="symptom-options"></div>
      `;
      const opts = row.querySelector(".symptom-options");
      s.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "symptom-option" + (current[s.id] === opt ? " selected" : "");
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          Storage.setSymptom(s.id, opt);
          renderSymptoms();
        });
        opts.appendChild(btn);
      });
      els.symptomGrid.appendChild(row);
    });
  }

  function renderNotes() {
    const notes = Storage.getNotes();
    els.noteList.innerHTML = "";
    if (!notes.length) {
      els.noteList.innerHTML = `<li>هنوز یادداشتی نداری. اولین یادداشتت رو بنویس 💭</li>`;
      return;
    }
    notes.slice(0, 10).forEach((n) => {
      const li = document.createElement("li");
      const date = new Date(n.date).toLocaleDateString("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      li.innerHTML = `${escapeHtml(n.text)}<small>${date}</small>`;
      els.noteList.appendChild(li);
    });
  }

  function renderTips() {
    const cycleDay = Cycle.getCurrentCycleDay();
    const phase = Cycle.getPhase(cycleDay);
    const tips = APP_CONFIG.TIPS[phase] || APP_CONFIG.TIPS.follicular;
    els.tipsContainer.innerHTML = tips
      .map((t) => `<div class="tip-item">${t}</div>`)
      .join("");
  }

  function renderHistory() {
    const periods = Storage.getPeriods();
    els.historyList.innerHTML = "";
    if (!periods.length) {
      els.historyList.innerHTML = `<li>هنوز دوره‌ای ثبت نکردی</li>`;
      return;
    }
    periods.slice(0, 6).forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${Cycle.formatDateFA(p.start)}</span>
        <span>${Cycle.formatDateFA(p.end)}</span>
      `;
      els.historyList.appendChild(li);
    });
  }

  // ========== چت ==========
  function openChat(mode) {
    chatMode = mode;
    els.chatTitle.textContent = mode === "companion" ? "همدم 🌸" : "چت هوشمند 💬";
    els.chatPanel.classList.add("open");
    renderChatHistory();
  }

  function closeChat() {
    els.chatPanel.classList.remove("open");
  }

  function renderChatHistory() {
    const history = Storage.getChatHistory(chatMode);
    els.chatMessages.innerHTML = "";
    if (!history.length) {
      const welcome =
        chatMode === "companion"
          ? "سلام رفیق! من اینجام تا به حرفات گوش بدم. هر چی تو دلت هست رو بگو، قضاوتت نمی‌کنم 🫂"
          : "سلام! هر سوالی درباره‌ی چرخه، سلامت یا هر چیز دیگه‌ای داری بپرس. کنارتم 🌸";
      addBubble("assistant", welcome);
      return;
    }
    history.forEach((m) => addBubble(m.role, m.content));
    scrollChatBottom();
  }

  function addBubble(role, text) {
    const div = document.createElement("div");
    div.className = `chat-bubble ${role}`;
    div.textContent = text;
    els.chatMessages.appendChild(div);
    scrollChatBottom();
  }

  function addTyping() {
    const div = document.createElement("div");
    div.className = "chat-bubble typing";
    div.id = "typing-indicator";
    div.textContent = "در حال نوشتن...";
    els.chatMessages.appendChild(div);
    scrollChatBottom();
  }

  function removeTyping() {
    const el = document.getElementById("typing-indicator");
    if (el) el.remove();
  }

  function scrollChatBottom() {
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  }

  // ========== تنظیمات ==========
  function openSettings() {
    const user = Storage.get().user;
    els.settingsName.value = user.name || "";
    els.settingsCycleLength.value = user.cycleLength || 28;
    els.settingsPeriodLength.value = user.periodLength || 5;
    els.settingsPanel.classList.add("open");
  }

  function closeSettings() {
    els.settingsPanel.classList.remove("open");
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  return {
    cacheEls,
    renderAll,
    renderHeader,
    openChat,
    closeChat,
    addBubble,
    addTyping,
    removeTyping,
    renderChatHistory,
    openSettings,
    closeSettings,
    getChatMode: () => chatMode,
    els,
  };
})();
