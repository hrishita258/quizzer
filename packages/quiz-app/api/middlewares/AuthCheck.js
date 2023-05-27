export const AuthCheck = (req, res, next) => {
  const user = req.user
  console.log(user)
  if (!user) {
    return res.json({ message: 'not authenticated', status: 403 })
  }
  next()
}
