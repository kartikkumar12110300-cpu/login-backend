const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const resultBox = document.querySelector("#resultBox");
const authState = document.querySelector("#authState");
const tokenPreview = document.querySelector("#tokenPreview");
const tokenDot = document.querySelector("#tokenDot");
const homeBtn = document.querySelector("#homeBtn");
const dashboardBtn = document.querySelector("#dashboardBtn");
const logoutBtn = document.querySelector("#logoutBtn");

const API_BASE = "/pages";

function showResult(data) {
  resultBox.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

function setActiveForm(formName) {
  const isLogin = formName === "login";
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("active", isLogin);
  registerForm.classList.toggle("active", !isLogin);
}

function updateAuthState() {
  const token = localStorage.getItem("token");
  tokenDot.classList.toggle("active", Boolean(token));
  authState.textContent = token ? "Logged in" : "Not logged in";
  tokenPreview.textContent = token ? `${token.slice(0, 28)}...` : "No token saved yet.";
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function submitAuth(event, path) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await request(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      updateAuthState();
    }

    showResult(data);
  } catch (error) {
    showResult({ error: error.message });
  }
}

loginTab.addEventListener("click", () => setActiveForm("login"));
registerTab.addEventListener("click", () => setActiveForm("register"));

loginForm.addEventListener("submit", (event) => submitAuth(event, "/login"));
registerForm.addEventListener("submit", (event) => submitAuth(event, "/register"));

homeBtn.addEventListener("click", async () => {
  try {
    showResult(await request("/home"));
  } catch (error) {
    showResult({ error: error.message });
  }
});

dashboardBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    showResult({ error: "Please login or register first." });
    return;
  }

  try {
    showResult(await request("/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  } catch (error) {
    showResult({ error: error.message });
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  updateAuthState();
  showResult("Logged out.");
});

updateAuthState();
