// src/utils/whatsapp.js
import config from "../config/index.js"; 

export const sendWhatsApp = async (target, message) => {
  try {
    const url = "https://api.fonnte.com/send";
    if (!target) return;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", process.env.FONNTE_TOKEN || "ztVGqeLmiuiyLjZjt58X");

    const body = JSON.stringify({
      target: target,
      message: message,
      countryCode: "62", 
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: body,
      redirect: "follow",
    };

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log("✅ WA Sent:", result))
      .catch((error) => console.error("❌ WA Error:", error));

  } catch (error) {
    console.error("❌ Gagal mengirim WA:", error);
  }
};