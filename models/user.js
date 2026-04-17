const users = new Map()

/**
 * This function creates a new user and adds it to the users map.
 * @param {*} user - An object representing the user, which should have an 'id' property.
 * @returns {void}
 * @example
 * createUser({ id: '1', name: 'John Doe' });
 */
export const createUser = (user) => {
  const generatedId = Date.now().toString()
  user.id = generatedId
  users.set(user.id, user)
}

/**
 * This function retrieves a user from the users map by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {*} The user object if found, otherwise undefined.
 * @example
 * getUser('1'); // returns { id: '1', name: 'John Doe' }
 */
export const getUser = (id) => {
  return users.get(id)
}

/**
 * This function deletes a user from the users map by their ID.
 * @param {string} id - The ID of the user to delete.
 * @returns {void}
 * @example
 * deleteUser('1');
 */
export const deleteUser = (id) => {
  users.delete(id)
}

/**
 * This function retrieves all users from the users map.
 * @returns {Array} An array of all user objects.
 * @example
 * getAllUsers(); // returns [{ id: '1', name: 'John Doe' }]
 */
export const getAllUsers = () => {
  return Array.from(users.values())
}
