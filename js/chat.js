const Chat = (() => {
  const SYSTEM_PROMPTS = {
    chat: `تو یک دستیار سلامت و چرخه‌ی قاعدگی هستی. با لحنی گرم، صمیمی و کاملاً عامیانه فارسی صحبت کن. 
    از اسم کاربر استفاده کن. اطلاعات پزشکی دقیق اما ساده بده. هرگز تشخیص قطعی نده و در موارد جدی کاربر رو به پزشک ارجاع بده. 
    پاسخ‌ها کوتاه و مفید باشن (حداکثر ۳-۴ جمله).`,
    companion: `تو یک همدم و رفیق گرم و صمیمی هستی. وظیفه‌ات گوش دادن، همدلی و آرامش دادن به کاربره.
    با لحن خیلی خودمانی، مهربون و بدون قضاوت صحبت کن. از اسم کاربر استفاده کن.
    اگر کاربر درباره‌ی درد یا ناراحتی صحبت کرد، همدلی کن و راهکارهای آرام‌بخش پیشنهاد بده.
    پاسخ‌هات کوتاه و صمیمی باشن. گاهی سوال بپرس تا کاربر بیشتر حرف بزنه.`,
  };

  async function sendMessage(userText) {
    const mode = UI.getChatMode();
    const history = Storage.getChatHistory(mode);

    // ذخیره پیام کاربر
    Storage.addChatMessage("user", userText, mode);
    UI.addBubble("user", userText);
    UI.addTyping();

    try {
      const messages = [
        { role: "system", content: SYSTEM_PROMPTS[mode] },
        ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userText },
      ];

      const res = await fetch(`${AI_CONFIG.BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AI_CONFIG.API_KEY}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL,
          messages,
          max_tokens: AI_CONFIG.MAX_TOKENS,
          temperature: AI_CONFIG.TEMPERATURE,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`API Error ${res.status}: ${err.slice(0, 200)}`);
      }

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content?.trim() ||
        "متأسفم، الان نتونستم جواب بدم. دوباره امتحان کن 🌸";

      Storage.addChatMessage("assistant", reply, mode);
      UI.removeTyping();
      UI.addBubble("assistant", reply);
    } catch (err) {
      UI.removeTyping();
      console.error("Chat error:", err);
      UI.addBubble(
        "assistant",
        "اوه، یه مشکلی پیش اومد. 😔 مطمئن شو کلید API رو درست تنظیم کردی و اینترنتت وصله. دوباره تلاش کن!"
      );
    }
  }

  return { sendMessage };
})();
