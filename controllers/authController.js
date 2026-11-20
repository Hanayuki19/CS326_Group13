import * as authService from "../services/authService.js";

const fromHtmx = (req) => req.get("HX-Request") === "true";
const fromForm = (req) => Boolean(req.is("application/x-www-form-urlencoded"));

const startSession = (req, userId) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);

      req.session.userId = userId;
      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });

const endSession = (req) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => (err ? reject(err) : resolve()));
  });

export const getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

export const getRegister = (req, res) => {
  res.render("register", { title: "Register" });
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);

  if (!result.ok) {
    if (fromHtmx(req)) {
      return res.status(result.error.status).send(result.error.message);
    }

    return res
      .status(result.error.status)
      .json({ error: result.error.message });
  }

  await startSession(req, result.value.id);
  const destination = `/students/student/${result.value.id}`;

  if (fromHtmx(req)) {
    return res.set("HX-Redirect", destination).status(200).end();
  }

  if (fromForm(req)) {
    return res.redirect(303, destination);
  }

  return res.status(200).json({ loggedIn: true, user: result.value });
};

export const register = async (req, res) => {
  const result = await authService.register(req.body);
  if (!result.ok) {
    if (fromHtmx(req)) {
      return res.status(result.error.status).send(result.error.message);
    }

    return res
      .status(result.error.status)
      .json({ error: result.error.message });
  }

  if (!fromHtmx(req) && !fromForm(req)) {
    return res.status(201).json(result.value);
  }

  await startSession(req, result.value.id);

  const destination = `/students/student/${result.value.id}`;
  if (fromHtmx(req)) {
    return res.set("HX-Redirect", destination).status(200).end();
  }

  return res.redirect(303, destination);
};

export const logout = async (req, res) => {
  await endSession(req);
  res.clearCookie("connect.sid");

  if (fromHtmx(req)) {
    return res.set("HX-Redirect", "/login").status(200).end();
  }

  if (fromForm(req) || req.get("Accept")?.includes("text/html")) {
    return res.redirect(303, "/login");
  }

  return res.status(200).json({ loggedOut: true });
};

export const me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not logged in." });
  }

  const result = await authService.getUserById(req.user.id);

  if (!result.ok) {
    return res.status(401).json({ error: "Not logged in." });
  }

  return res.status(200).json(result.value);
};
