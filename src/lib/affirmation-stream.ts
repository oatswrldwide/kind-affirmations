// Use Express backend URL from env, fallback to localhost for development
const AFFIRMATION_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/generate-affirmation';

export async function streamAffirmation({
  message,
  onDelta,
  onDone,
  onError,
}: {
  message: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    const resp = await fetch(AFFIRMATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!resp.ok) {
      let errorData;
      try {
        errorData = await resp.json();
      } catch {
        errorData = { error: "Unable to connect to the service." };
      }
      
      // User-friendly error messages based on status codes
      let userMessage = errorData.error || "Something went wrong. Please try again.";
      
      if (resp.status === 400) {
        userMessage = errorData.error || "Please check your input and try again.";
      } else if (resp.status === 429) {
        userMessage = "Too many requests. Please wait a moment and try again.";
      } else if (resp.status === 502 || resp.status === 503) {
        userMessage = "Service temporarily unavailable. Please try again in a moment.";
      } else if (resp.status === 504) {
        userMessage = "Request timed out. Please try again.";
      } else if (resp.status >= 500) {
        userMessage = "Server error. Please try again later.";
      }
      
      onError(userMessage);
      return;
    }

    if (!resp.body) {
      onError("No response received.");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e) {
    console.error("Stream error:", e);
    onError("Connection error. Please try again.");
  }
}
