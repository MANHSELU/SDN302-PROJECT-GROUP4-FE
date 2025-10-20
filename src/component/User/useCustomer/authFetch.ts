// utils/authFetch.ts
export async function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // gọi API ban đầu
  let res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // nếu access token hết hạn (401)
  if (res.status === 401 && refreshToken) {
    console.log("🔁 Token hết hạn → Gọi refresh token...");
    const refreshRes = await fetch(
      "http://localhost:3000/api/user/notcheck/refersh_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }), // gửi đúng field như BE
      }
    );

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      // Lưu lại token mới
      localStorage.setItem("token", data.access_Token);

      // Nếu backend có cấp refresh token mới thì lưu luôn
      if (data.refresh_token) {
        localStorage.setItem("refreshToken", data.refresh_token);
      }

      // Gọi lại request ban đầu với access token mới
      res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_Token}`,
          ...options.headers,
        },
      });
    } else {
      console.warn("🚨 Refresh token hết hạn → Logout");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject("Refresh token expired");
    }
  }

  return res;
}
