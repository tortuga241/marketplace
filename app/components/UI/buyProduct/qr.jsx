"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRCodeGenerator() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const targetUrl = "https://utikadmd.ru/wp-content/uploads/2023/01/1.png";
    QRCode.toDataURL(targetUrl, { errorCorrectionLevel: "H", width: 300 })
      .then(setQrUrl)
      .catch(console.error);
  }, []);

  if (!qrUrl) return <p>Генерация QR...</p>;

  return (
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>QR для оплаты</h2>
      <img src={qrUrl} alt="QR Code" style={{ width: 250 }} />
      <p>Отсканируй, чтобы оплатить</p>
    </div>
  );
}
