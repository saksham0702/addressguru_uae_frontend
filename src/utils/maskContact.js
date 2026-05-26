/**
 * Masks an email address for privacy/SEO.
 * Example: test@example.com -> te***@example.com
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== "string") return "";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const maskedName = name.length > 2 ? name.substring(0, 2) + "***" : name + "***";
  return `${maskedName}@${domain}`;
};

/**
 * Masks a phone number for privacy/SEO.
 * Example: 501234567 -> 501*** ****
 */
export const maskPhone = (phone, countryCode = "") => {
  if (!phone) return "";
  const cleaned = String(phone).trim();
  const code = countryCode ? String(countryCode).trim() + " " : "";

  if (cleaned.length <= 4) return `${code}${cleaned}***`;

  // Showing first 3 digits and masking the rest
  const visible = cleaned.substring(0, 3);
  return `${code}${visible}*** ****`;
};
