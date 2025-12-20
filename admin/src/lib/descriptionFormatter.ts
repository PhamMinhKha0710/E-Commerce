/**
 * Utility functions để format description sản phẩm
 * Chuyển đổi giữa plain text và HTML
 */

/**
 * Format description từ plain text sang HTML
 * - Double line breaks → paragraphs (<p>)
 * - Single line breaks → line breaks (<br>)
 * - Lines starting with "- " or "* " → list items (<ul><li>)
 * - Escape HTML để tránh XSS
 */
export function formatDescriptionToHtml(text: string): string {
  if (!text) return ""
  
  // Nếu đã có HTML tags, giữ nguyên
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return text
  }
  
  // Escape HTML để tránh XSS
  const escapeHtml = (str: string) => {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return str.replace(/[&<>"']/g, (m) => map[m])
  }
  
  // Split by double line breaks để tạo paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  
  // Format mỗi paragraph
  const formattedParagraphs = paragraphs.map(paragraph => {
    // Split by single line breaks để tạo line breaks
    const lines = paragraph.split(/\n/).filter(line => line.trim().length > 0)
    const formattedLines = lines.map(line => {
      const escaped = escapeHtml(line.trim())
      // Nếu line bắt đầu bằng "- " hoặc "* ", tạo list item
      if (escaped.match(/^[-*]\s/)) {
        return `<li>${escaped.replace(/^[-*]\s/, '')}</li>`
      }
      return escaped
    })
    
    // Nếu có list items, wrap trong <ul>
    if (formattedLines.some(line => line.startsWith('<li>'))) {
      return `<ul>${formattedLines.join('')}</ul>`
    }
    
    // Nếu không, wrap trong <p>
    return `<p>${formattedLines.join('<br>')}</p>`
  })
  
  return formattedParagraphs.join('')
}

/**
 * Convert HTML về plain text để hiển thị trong textarea
 * - <p> → double line break
 * - <br> → single line break
 * - <ul><li> → "- " prefix
 * - Remove all other HTML tags
 * - Decode HTML entities
 */
export function htmlToPlainText(html: string): string {
  if (!html) return ""
  
  // Remove HTML tags và decode entities
  let text = html
    .replace(/<p>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<ul>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<li>/gi, '- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
  
  // Clean up multiple newlines
  text = text.replace(/\n{3,}/g, '\n\n').trim()
  return text
}

