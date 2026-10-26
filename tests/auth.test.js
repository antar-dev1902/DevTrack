import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  getStoredUsers,
  getStoredCredentials,
} from '../src/services/authService.js';

function createMockStorage(seed = {}) {
  const store = new Map(Object.entries(seed));
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: (key) => { store.delete(key); },
    clear: () => { store.clear(); },
  };
}

test('1. Register a new user with valid information', async () => {
  const storage = createMockStorage();
  const regResult = await registerUser(
    {
      name: 'Taylor Swift',
      email: 'taylor@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    },
    storage,
  );

  assert.equal(regResult.success, true);
  assert.equal(regResult.user.name, 'Taylor Swift');
  assert.equal(regResult.user.email, 'taylor@example.com');
  assert.ok(regResult.session?.token);

  // Profile exists in devtrack_users
  const users = getStoredUsers(storage);
  assert.equal(users.length, 1);
  assert.equal(users[0].name, 'Taylor Swift');
});

test('2. Attempt to register the same email again is rejected (case-insensitive)', async () => {
  const storage = createMockStorage();
  await registerUser(
    {
      name: 'Taylor Swift',
      email: 'taylor@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    },
    storage,
  );

  // Attempt with same email in different capitalization
  const dupResult = await registerUser(
    {
      name: 'Taylor S.',
      email: 'TAYLOR@EXAMPLE.COM',
      password: 'password456',
      confirmPassword: 'password456',
    },
    storage,
  );

  assert.equal(dupResult.success, false);
  assert.ok(dupResult.errors?.email);
  assert.match(dupResult.errors.email, /already exists/i);
});

test('3. Attempt to log in with an unknown email is rejected', async () => {
  const storage = createMockStorage();
  const loginResult = await loginUser(
    {
      email: 'nonexistent@example.com',
      password: 'password123',
    },
    storage,
  );

  assert.equal(loginResult.success, false);
  assert.ok(loginResult.errors?.form);
  assert.match(loginResult.errors.form, /No account found/i);

  // Verifying no new user account was created
  const users = getStoredUsers(storage);
  assert.equal(users.length, 0);
});

test('4. Attempt to log in with an incorrect password is rejected', async () => {
  const storage = createMockStorage();
  await registerUser(
    {
      name: 'Taylor Swift',
      email: 'taylor@example.com',
      password: 'correctPassword',
      confirmPassword: 'correctPassword',
    },
    storage,
  );

  const wrongPwResult = await loginUser(
    {
      email: 'taylor@example.com',
      password: 'wrongPassword',
    },
    storage,
  );

  assert.equal(wrongPwResult.success, false);
  assert.ok(wrongPwResult.errors?.form);
  assert.match(wrongPwResult.errors.form, /Incorrect password/i);
});

test('5. Log in with the correct credentials succeeds and creates a session', async () => {
  const storage = createMockStorage();
  await registerUser(
    {
      name: 'Morgan Freeman',
      email: 'morgan@example.com',
      password: 'securePassword99',
      confirmPassword: 'securePassword99',
    },
    storage,
  );

  // Clear current user/session to simulate fresh login
  logoutUser(storage);
  assert.equal(getCurrentUser(storage), null);

  const loginResult = await loginUser(
    {
      email: 'MORGAN@EXAMPLE.COM', // test case insensitivity
      password: 'securePassword99',
    },
    storage,
  );

  assert.equal(loginResult.success, true);
  assert.equal(loginResult.user.name, 'Morgan Freeman');
  assert.ok(loginResult.session?.token);
  assert.equal(getCurrentUser(storage)?.name, 'Morgan Freeman');
});

test('6. Session behavior persists through refresh/reload', async () => {
  const storage = createMockStorage();
  await registerUser(
    {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'adaPassword123',
      confirmPassword: 'adaPassword123',
    },
    storage,
  );

  // Current session is active
  const activeUser = getCurrentUser(storage);
  assert.equal(activeUser.email, 'ada@example.com');

  // Simulate browser restart / new process reading the exact same storage
  const restoredUser = getCurrentUser(storage);
  assert.deepEqual(restoredUser, activeUser);
});

test('7. Log out clears active session and protected content is no longer accessible', async () => {
  const storage = createMockStorage();
  await registerUser(
    {
      name: 'Alan Turing',
      email: 'alan@example.com',
      password: 'enigmaPassword123',
      confirmPassword: 'enigmaPassword123',
    },
    storage,
  );

  assert.ok(getCurrentUser(storage));
  logoutUser(storage);

  assert.equal(getCurrentUser(storage), null);
  assert.equal(storage.getItem('devtrack_session'), null);
  assert.equal(storage.getItem('devtrack_current_user'), null);
});

test('8. Passwords and hashes are NOT exposed in user profile objects or localStorage users list', async () => {
  const storage = createMockStorage();
  const rawPassword = 'verySecretPassword123';
  const regResult = await registerUser(
    {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      password: rawPassword,
      confirmPassword: rawPassword,
    },
    storage,
  );

  // Verify returned user object
  assert.equal(regResult.user.password, undefined);
  assert.equal(regResult.user.hash, undefined);
  assert.equal(regResult.user.salt, undefined);

  // Verify devtrack_users list
  const users = getStoredUsers(storage);
  for (const u of users) {
    assert.equal(u.password, undefined);
    assert.equal(u.hash, undefined);
    assert.equal(u.salt, undefined);
    assert.equal(JSON.stringify(u).includes(rawPassword), false);
  }

  // Verify devtrack_current_user
  const currentUserRaw = storage.getItem('devtrack_current_user');
  assert.equal(currentUserRaw.includes(rawPassword), false);
  assert.equal(currentUserRaw.includes('hash'), false);

  // Verify isolated credential store holds the hash (not plain text password)
  const credentials = getStoredCredentials(storage);
  assert.equal(credentials.length, 1);
  assert.equal(credentials[0].password, undefined);
  assert.ok(credentials[0].hash);
  assert.ok(credentials[0].salt);
  assert.notEqual(credentials[0].hash, rawPassword);
});

test('9. Field validation and error messages are clear and accurate', async () => {
  const storage = createMockStorage();

  // Missing name
  const emptyName = await registerUser({ name: '', email: 'test@example.com', password: 'password123', confirmPassword: 'password123' }, storage);
  assert.equal(emptyName.errors.name, 'Full name is required.');

  // Invalid email format
  const badEmail = await registerUser({ name: 'Bob', email: 'notanemail', password: 'password123', confirmPassword: 'password123' }, storage);
  assert.equal(badEmail.errors.email, 'Please enter a valid email address.');

  // Short password
  const shortPw = await registerUser({ name: 'Bob', email: 'bob@example.com', password: '123', confirmPassword: '123' }, storage);
  assert.equal(shortPw.errors.password, 'Password must be at least 6 characters.');

  // Mismatched confirmation password
  const mismatch = await registerUser({ name: 'Bob', email: 'bob@example.com', password: 'password123', confirmPassword: 'differentPassword' }, storage);
  assert.equal(mismatch.errors.confirmPassword, 'Passwords do not match.');
});

test('10. Legacy unverified demo users require signup to activate password', async () => {
  const storage = createMockStorage();

  // Attempt login with demo user who has no credentials
  const demoLogin = await loginUser({ email: 'antarjot@example.com', password: 'somePassword' }, storage);
  assert.equal(demoLogin.success, false);
  assert.match(demoLogin.errors.form, /does not have verified credentials/i);

  // Signing up with that email attaches verified credentials to the existing profile
  const activateResult = await registerUser(
    {
      name: 'Antarjot Singh',
      email: 'antarjot@example.com',
      password: 'newSecurePassword123',
      confirmPassword: 'newSecurePassword123',
    },
    storage,
  );
  assert.equal(activateResult.success, true);
  assert.equal(activateResult.user.id, 'u-1');

  // Now login succeeds with the newly configured password
  const postActivateLogin = await loginUser({ email: 'antarjot@example.com', password: 'newSecurePassword123' }, storage);
  assert.equal(postActivateLogin.success, true);
});
