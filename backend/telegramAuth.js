import crypto from "crypto";

export function verifyTelegramAuth(initData, botToken) {
  if (!botToken) {
    throw new Error("Telegram bot token is missing in verifyTelegramAuth");
  }

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash") || "";
  urlParams.delete("hash");

  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === hash;
}