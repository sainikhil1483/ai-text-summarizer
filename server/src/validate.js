export function validateInput(text) {
  if (!text || typeof text !== "string") {
    return { valid: false, error: "Input must be a non-empty string." };
  }

  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Input text cannot be empty." };
  }

  if (trimmed.length < 20) {
    return {
      valid: false,
      error: "Input text is too short. Please provide at least 20 characters.",
    };
  }

  if (trimmed.length > 10000) {
    return {
      valid: false,
      error: "Input text is too long. Please keep it under 10,000 characters.",
    };
  }

  return { valid: true, text: trimmed };
}
