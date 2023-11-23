function extractTOCFromMarkdown(markdown) {
  const lines = markdown.split('\n')
  const headingRegex = /^(#+)\s+(.*)$/
  const root = { level: 0, title: 'Root', children: [] }

  let currentLevel = root
  let toc = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const match = line.match(headingRegex)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      const anchor = getAnchor(title)

      const node = { title, anchor, children: [] }

      if (level > currentLevel.level) {
        currentLevel.children.push(node)
        currentLevel = node
      } else {
        while (level <= currentLevel.level) {
          currentLevel = currentLevel.parent
        }
        currentLevel.children.push(node)
        currentLevel = node
      }

      toc.push(node)
    }
  }

  return root.children
}

function getAnchor(text) {
  return text.toLowerCase().replace(/\s+/g, '-')
}

export default extractTOCFromMarkdown
