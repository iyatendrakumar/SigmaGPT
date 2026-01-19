const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;


/* ================= REGISTER ================= */

export const sendRegisterOtp = async (data) => {
  const res = await fetch(`${BASE_URL}/register/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const verifyRegisterOtp = async (data) => {
  const res = await fetch(`${BASE_URL}/register/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

/* ================= LOGIN ================= */

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

/* ================= FORGOT PASSWORD ================= */

export const sendResetOtp = async (data) => {
  const res = await fetch(`${BASE_URL}/forgot-password/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

export const resetPassword = async (data) => {
  const res = await fetch(`${BASE_URL}/forgot-password/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};
