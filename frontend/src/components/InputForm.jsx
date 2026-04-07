import { useState } from 'react'
import './InputForm.css'

const MAX_CHARS = 300

const FIELDS = [
  {
    id: 'shipped',
    label: 'What Shipped',
    placeholder: 'e.g. Launched onboarding redesign and fixed 3 critical bugs'
  },
  {
    id: 'metrics',
    label: 'Metrics',
    placeholder: 'e.g. Activation rate up 12%, support tickets down 20%'
  },
  {
    id: 'risks',
    label: 'Risks & Blockers',
    placeholder: 'e.g. Payment integration delayed 1 week due to third-party API issues'
  }
]

function InputForm({ onSubmit, isLoading }) {
  const [values, setValues] = useState({ shipped: '', metrics: '', risks: '' })
  const [errors, setErrors] = useState({ shipped: '', metrics: '', risks: '' })

  function handleChange(fieldId, value) {
    if (value.length > MAX_CHARS) return
    setValues(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  function validate() {
    const newErrors = { shipped: '', metrics: '', risks: '' }
    let isValid = true
    FIELDS.forEach(({ id, label }) => {
      if (!values[id].trim()) {
        newErrors[id] = `${label} is required`
        isValid = false
      }
    })
    setErrors(newErrors)
    return isValid
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit({
      shipped: values.shipped.trim(),
      metrics: values.metrics.trim(),
      risks:   values.risks.trim()
    })
  }

  return (
    <div className="input-form">
      {FIELDS.map(({ id, label, placeholder }) => {
        const charCount  = values[id].length
        const isNearLimit = charCount >= MAX_CHARS * 0.85

        return (
          <div className="field-group" key={id}>
            <label htmlFor={id}>{label}</label>
            <textarea
              id={id}
              rows={3}
              placeholder={placeholder}
              value={values[id]}
              onChange={e => handleChange(id, e.target.value)}
              className={errors[id] ? 'has-error' : ''}
              disabled={isLoading}
            />
            <div className="field-meta">
              {errors[id]
                ? <span className="field-error">{errors[id]}</span>
                : <span />
              }
              <span className={`char-count ${isNearLimit ? 'near-limit' : ''}`}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>
          </div>
        )
      })}

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading && <span className="btn-spinner" />}
        {isLoading ? 'Generating...' : 'Generate Updates'}
      </button>
    </div>
  )
}

export default InputForm