const spinnerStyle = {
  width: '32px',
  height: '32px',
  border: '4px solid #e0e0e0',
  borderTop: '4px solid #333',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  margin: '24px auto'
}

const keyframesStyle = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`

function LoadingSpinner() {
  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={spinnerStyle} />
    </>
  )
}

export default LoadingSpinner