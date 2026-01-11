import authMiddleware from './authMiddleware.js';
import roleMiddleware from './roleMiddleware.js';
import errorHandler from './errorHandler.js';

export { authMiddleware, roleMiddleware, errorHandler };

export default {
  authMiddleware,
  roleMiddleware,
  errorHandler,
};
