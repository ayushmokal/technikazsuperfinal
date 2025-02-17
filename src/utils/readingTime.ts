export function calculateReadingTime(content: string): number {
  // Average reading speed (words per minute)
  const wordsPerMinute = 200;
  
  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return readingTime;
}