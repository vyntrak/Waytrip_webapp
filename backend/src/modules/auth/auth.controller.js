const { registerUser, loginUser, getUserById } = require('./auth.service');

async function register(req, res) {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: 'firstName, lastName, email and password are required',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const result = await registerUser({ firstName, lastName, email, password, role });

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(201).json({
    message: 'User registered successfully',
    user: result.user,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }

  const result = await loginUser({ email, password });

  if (result.error) {
    return res.status(result.status).json({ message: result.error });
  }

  return res.status(200).json({
    message: 'Login successful',
    token: result.token,
    user: result.user,
  });
}

async function me(req, res) {
  const user = await getUserById(req.user.sub);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ user });
}

module.exports = {
  register,
  login,
  me,
};
