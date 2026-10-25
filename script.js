// Укажите реальную ссылку на Telegram-бота, например https://t.me/your_bot
const TELEGRAM_BOT_URL = "https://t.me/MarketIQ_probot?start=d40832bad9";

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".bot-link").forEach((link) => {
  if (TELEGRAM_BOT_URL && /^https:\/\/t\.me\/[A-Za-z0-9_]+(?:\?start=[A-Za-z0-9_-]+)?\/?$/.test(TELEGRAM_BOT_URL)) {
    link.href = TELEGRAM_BOT_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const notice = link.parentElement.querySelector(".disclaimer");
    if (notice && notice.textContent.includes("Ссылка на бота ещё не настроена")) notice.hidden = true;
  } else {
    link.href = "#start";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Ссылка на Telegram-бот ещё не добавлена. Укажите TELEGRAM_BOT_URL в файле script.js.");
    });
  }
});

const fields = ["buyPrice", "sellPrice", "quantity", "fee"].map(id => document.getElementById(id));
const fmt = value => Number.isFinite(value) ? value.toFixed(2) : "—";
function calculate() {
  const [buyEl, sellEl, qtyEl, feeEl] = fields;
  const buy = Number(buyEl.value), sell = Number(sellEl.value);
  const qty = Number(qtyEl.value), feePct = Number(feeEl.value);
  const valid = buy > 0 && sell > 0 && qty > 0 && feePct >= 0 && feePct <= 100 &&
    [buy, sell, qty, feePct].every(Number.isFinite);
  const grossEl = document.getElementById("gross");
  const feesEl = document.getElementById("fees");
  const netEl = document.getElementById("net");
  const note = document.getElementById("calcNote");
  if (!valid) {
    grossEl.textContent = feesEl.textContent = netEl.textContent = "—";
    note.textContent = "Введите положительные цены и количество. Комиссия должна быть от 0 до 100%.";
    netEl.className = "";
    return;
  }
  const buyTotal = buy * qty;
  const sellTotal = sell * qty;
  const fees = (buyTotal + sellTotal) * feePct / 100;
  const gross = sellTotal - buyTotal;
  const net = gross - fees;
  grossEl.textContent = fmt(gross);
  feesEl.textContent = fmt(fees);
  netEl.textContent = fmt(net);
  netEl.className = net >= 0 ? "good" : "bad";
  note.textContent = net >= 0
    ? "В упрощённой модели после указанной комиссии остаётся положительная разница. Это не учитывает прочие расходы и не гарантирует реальный результат."
    : "В упрощённой модели комиссии превышают разницу между ценами. Дополнительные расходы могут ещё сильнее изменить итог.";
}
fields.forEach(field => field.addEventListener("input", calculate));
calculate();

document.querySelectorAll(".quiz-option").forEach(button => {
  button.addEventListener("click", () => {
    const feedback = document.getElementById("quizFeedback");
    if (button.dataset.answer === "b") {
      feedback.textContent = "Верно. При прочих равных рост комиссий увеличивает расходы и уменьшает итоговый результат.";
    } else {
      feedback.textContent = "Не совсем. Комиссии — это расходы, поэтому при прочих равных их рост уменьшает итоговый результат.";
    }
    document.querySelectorAll(".quiz-option").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  });
});
