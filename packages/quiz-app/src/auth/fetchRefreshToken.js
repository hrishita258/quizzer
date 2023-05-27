export const fetchRefreshToken = async token => {
  const response = await fetch('http://localhost:4000/refresh', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await response.json()
  return data
}
