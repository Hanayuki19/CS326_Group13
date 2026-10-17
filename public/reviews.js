const form = document.querySelector("#entry-form");
const list = document.querySelector("#entries");
const errorBox = document.querySelector("#form-error");

const buildItem = (entry) => {
  const item = document.createElement("li");
  item.dataset.id = entry.id;
  const display = document.createElement("span");
  display.className = "entry-display";
  const title = document.createElement("strong");
  title.textContent = `${entry.course} (${entry.rating}/5):`;
  display.append(title, ` ${entry.comment}`);
  item.append(display);
  return item;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";
  const entry = Object.fromEntries(new FormData(form));
  const button = form.querySelector("button");
  if (button.disabled) return;
  button.disabled = true;
  try {
    const response = await fetch("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      const { error } = await response.json();
      errorBox.textContent = error;
      return;
    }
    list.append(buildItem(await response.json()));
    form.reset();
  } catch {
    errorBox.textContent =
      "Your review was not saved: the server did not answer properly. Please try again.";
  } finally {
    button.disabled = false;
  }
});