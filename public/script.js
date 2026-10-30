const $ = (selector) => document.querySelector(selector);
const menuToggle = $("#menuToggle");
const nav = $("#nav");
const authDialog = $("#authDialog");
const authForm = $("#authForm");
const authStatus = $("#authStatus");
const authTitle = $("#authTitle");
const authSubmit = $("#authSubmit");
const nameField = $("#nameField");
const welcomeUser = $("#welcomeUser");
const openAuthButton = $("#openAuth");
const logoutButton = $("#logoutButton");
let authMode = "login";
let toastTimer;

$("#year").textContent = new Date().getFullYear();

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);cd C:\Users\saras\Downloads\skillup-training-institute-pro\skillup-training-institutecd C:\Users\saras\Downloads\skillup-training-institute-pro\skillup-training-institute
}

function getToken() {
  return localStorage.getItem("skillupToken");
}

function updateAuthUI(user) {
  if (user) {
    openAuthButton.classList.add("hidden");
    logoutButton.classList.remove("hidden");
    welcomeUser.textContent = `Welcome, ${user.name}! You are logged in.`;
    welcomeUser.classList.remove("hidden");
    $("#contactName").value ||= user.name;
    $("#contactEmail").value ||= user.email;
  } else {
    openAuthButton.classList.remove("hidden");
    logoutButton.classList.add("hidden");
    welcomeUser.classList.add("hidden");
  }
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", String(active));
  });
  nameField.classList.toggle("hidden", mode !== "register");
  $("#authName").required = mode === "register";
  $("#authPassword").autocomplete = mode === "register" ? "new-password" : "current-password";
  authTitle.textContent = mode === "register" ? "Create your account" : "Welcome to SkillUp";
  authSubmit.textContent = mode === "register" ? "Create account" : "Log in";
  setStatus(authStatus, "");
}

document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => setAuthMode(tab.dataset.mode));
});

openAuthButton.addEventListener("click", () => {
  setAuthMode("login");
  authForm.reset();
  authDialog.showModal();
});
$("#closeAuth").addEventListener("click", () => authDialog.close());
authDialog.addEventListener("click", (event) => {
  if (event.target === authDialog) authDialog.close();
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("skillupToken");
  updateAuthUI(null);
  showToast("You have logged out.");
});

async function apiRequest(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

async function loadCourses() {
  const grid = $("#courseGrid");
  try {
    const data = await apiRequest("/api/courses");
    grid.replaceChildren();
    data.courses.forEach((course) => {
      const card = document.createElement("article");
      card.className = "course-card";
      const icon = document.createElement("div");
      icon.className = "course-icon";
      icon.textContent = course.icon;
      const category = document.createElement("span");
      category.className = "course-category";
      category.textContent = course.category;
      const title = document.createElement("h3");
      title.textContent = course.title;
      const description = document.createElement("p");
      description.textContent = course.description;
      const meta = document.createElement("div");
      meta.className = "course-meta";
      [course.duration, course.level].forEach((value) => {
        const tag = document.createElement("span");
        tag.textContent = value;
        meta.appendChild(tag);
      });
      const link = document.createElement("a");
      link.className = "course-link";
      link.href = "#contact";
      link.textContent = "Ask about this course →";
      link.addEventListener("click", () => {
        $("#contactMessage").value = `Hello, I would like to know more about ${course.title}.`;
      });
      card.append(icon, category, title, description, meta, link);
      grid.appendChild(card);
    });
  } catch (error) {
    grid.textContent = "Could not load courses. Make sure the server and database are running.";
  }
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus(authStatus, "Please wait…");
  authSubmit.disabled = true;
  const body = {
    email: $("#authEmail").value.trim(),
    password: $("#authPassword").value
  };
  if (authMode === "register") body.name = $("#authName").value.trim();

  try {
    const data = await apiRequest(`/api/auth/${authMode === "register" ? "register" : "login"}`, {
      method: "POST",
      body: JSON.stringify(body)
    });
    localStorage.setItem("skillupToken", data.token);
    updateAuthUI(data.user);
    authDialog.close();
    authForm.reset();
    showToast(data.message);
  } catch (error) {
    setStatus(authStatus, error.message, true);
  } finally {
    authSubmit.disabled = false;
  }
});

$("#contactForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type=submit]");
  const status = $("#contactStatus");
  button.disabled = true;
  setStatus(status, "Sending your enquiry…");
  const body = {
    name: $("#contactName").value.trim(),
    email: $("#contactEmail").value.trim(),
    message: $("#contactMessage").value.trim()
  };
  try {
    const data = await apiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify(body)
    });
    setStatus(status, data.message);
    event.currentTarget.reset();
    const token = getToken();
    if (token) {
      try {
        const me = await apiRequest("/api/auth/me");
        $("#contactName").value = me.user.name;
        $("#contactEmail").value = me.user.email;
      } catch (_) {}
    }
  } catch (error) {
    setStatus(status, error.message, true);
  } finally {
    button.disabled = false;
  }
});

async function restoreSession() {
  const token = getToken();
  if (!token) return;
  try {
    const data = await apiRequest("/api/auth/me");
    updateAuthUI(data.user);
  } catch (_) {
    localStorage.removeItem("skillupToken");
    updateAuthUI(null);
  }
}

loadCourses();
restoreSession();