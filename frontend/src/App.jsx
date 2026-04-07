import { useState, useRef } from 'react'
import './App.css'
import InputForm      from './components/InputForm'
import OutputSection  from './components/OutputSection'
import ErrorMessage   from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'

const OUTPUT_SECTIONS = [
  { key: 'slack',             title: 'Slack Message',     emoji: '💬' },
  { key: 'email',             title: 'Email',             emoji: '📧' },
  { key: 'executive_summary', title: 'Executive Summary', emoji: '📊' }
]

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState('')
  const [results,   setResults]   = useState(null)

  const resultsRef = useRef(null)

  async function handleSubmit(formData) {
    setIsLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setResults(data)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)

    } catch (err) {
      setError('Could not reach the server. Is it running?')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">

      <header className="app-header">
        <h1>Stakeholder Update Generator</h1>
        <p>Fill in 3 fields. Get a Slack message, email, and executive summary instantly.</p>
      </header>

      <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

      {isLoading && <LoadingSpinner />}

      {error && <ErrorMessage message={error} />}

      {results && (
        <div ref={resultsRef} style={{ marginTop: '40px' }}>
          <div className="results-header">
            <h2>Your Updates</h2>
            <p>Click Copy on any section to grab it instantly.</p>
          </div>

          {OUTPUT_SECTIONS.map(({ key, title, emoji }) => (
            <OutputSection
              key={key}
              colorKey={key}
              title={title}
              emoji={emoji}
              content={results[key]}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default App