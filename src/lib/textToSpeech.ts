export function speakText(text: string) {
  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure voice settings for kids
  utterance.rate = 0.9; // Slightly slower for better comprehension
  utterance.pitch = 1.1; // Slightly higher pitch for friendliness
  utterance.volume = 1.0;
  
  // Try to use a friendly voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoices = voices.filter(voice => 
    voice.name.includes('Google US English') || 
    voice.name.includes('Microsoft') ||
    voice.name.includes('Samantha') ||
    voice.lang.startsWith('en')
  );
  
  if (preferredVoices.length > 0) {
    utterance.voice = preferredVoices[0];
  }

  // Speak the text
  window.speechSynthesis.speak(utterance);
}