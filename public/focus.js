// Keeps keyboard focus on a real element across htmx swaps, and adds the
// Alt+Shift+N shortcut. Everything else is done in the server-rendered HTML.

let lastFocused = null;
let lastFocusedId = "";
let focusAfterId = "";

// Remember where focus was before the request, while the element still exists.
document.addEventListener("htmx:beforeRequest", () => {
  const active = document.activeElement;
  if (!active || active === document.body) {
    lastFocused = null;
    return;
  }
  lastFocused = active;
  lastFocusedId = active.id;
  // Set in the partials: the id to focus once this control is swapped away
  // (Edit -> the name field, Save and Cancel -> the row's Edit button).
  focusAfterId = active.dataset.focusAfter || "";
});

// After the swap, put focus back: the same element if it is still on the
// page, else its replacement with the same id, else the element it named in
// data-focus-after, else the list (after a delete nothing of the row is left).
document.addEventListener("htmx:afterRequest", () => {
  if (!lastFocused) return;
  const target =
    (lastFocused.isConnected && lastFocused) ||
    (lastFocusedId && document.getElementById(lastFocusedId)) ||
    (focusAfterId && document.getElementById(focusAfterId)) ||
    document.getElementById("entries");
  lastFocused = null;
  if (target && target !== document.activeElement) target.focus();
});

// Alt+Shift+N jumps to the name field of the add-student form. event.code is
// the physical key, so it works even where Alt+N types a character. Two
// modifiers, never a bare letter (WCAG 2.1.4 Character Key Shortcuts).
document.addEventListener("keydown", (event) => {
  if (!event.altKey || !event.shiftKey || event.ctrlKey || event.metaKey) return;
  if (event.code !== "KeyN") return;
  const nameField = document.getElementById("student-name");
  if (!nameField) return;
  event.preventDefault();
  nameField.focus();
});
