import { verifyJWT } from '../helpers/generate-jwt.js';
import { findUserById } from '../helpers/user-db.js';

/**
 * Middleware para validar JWT
 */
export const validateJWT = async (req, res, next) => {
  try {
    let token =
      req.header('x-token') ||
      req.header('authorization') ||
      req.body.token ||
      req.query.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token en la petición',
      });
    }

    // Limpiar el token si viene con Bearer
    token = token.replace(/^Bearer\s+/, '');

    // Verificar el token
    const decoded = await verifyJWT(token);

    // Buscar el usuario por ID (decoded.sub es string)
    const user = await findUserById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token no válido - Usuario no existe',
      });
    }

    // Verificar si el usuario está activo
    if (!user.Status) {
      return res.status(423).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al administrador.',
      });
    }

    // Agregar el usuario al request
    req.user = user;
    req.userId = user.Id.toString();

    next();
  } catch (error) {
    console.error('Error validating JWT:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
        error: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: 'INVALID_TOKEN',
      });
    }

    // Cualquier otro error (timeout/conexión a la base de datos, etc.) es un
    // fallo de infraestructura, no un token inválido: no debe responder 401
    // ni disparar un logout en el frontend.
    return res.status(503).json({
      success: false,
      message: 'Servicio no disponible temporalmente, intenta de nuevo',
      error: 'AUTH_SERVICE_UNAVAILABLE',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
