const form = document.querySelector("#login-form");

const makeButton = (className, label) => {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.textContent = label;
  return button;
};

// Setting .value, not a value="..." attribute in a string, so a quote in the
// title cannot end the attribute early.
const makeInput = (name, value) => {
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.value = value;
  return input;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const entry = Object.fromEntries(data);
  const button = form.querySelector("button");

  // One save at a time: a second click while this one is out does nothing.
  if (button.disabled) return;
  button.disabled = true;
  try {
    // The current create route requires a path parameter but assigns its own ID.
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const { error } = await response.json();
      alert(error);
      return;
    }

    alert("Logged in, redirecting.");
    form.reset();

    const result = await response.json();
    window.location.href = result.redirect;
  } catch {
    // No answer, no connection, or an error page that is not JSON. What
    // they typed is still in the form, so they can simply try again.
    alert(
      "Your login was unsuccessful: the server did not answer properly. Please try again.",
    );
  } finally {
    button.disabled = false;
  }


});
