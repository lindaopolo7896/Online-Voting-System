export default function maskEmail(email) {
  const [name, domain] = email.split("@");

  const visiblePart = name.slice(0, 3);
  const maskedPart = "*".repeat(name.length - 3);

  return `${visiblePart}${maskedPart}@${domain}`;
}
