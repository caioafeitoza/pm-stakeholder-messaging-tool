import { useState } from 'react'
import './OutputSection.css'

function OutputSection({ title, content, emoji, colorKey }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={`output-section ${colorKey}`}>
      <div className="output-header">
        <h2>{emoji} {title}</h2>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="output-content">{content}</pre>
    </div>
  )
}

export default OutputSection