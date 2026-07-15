'use strict';

/**
 * Parsea page/limit de query. Sin limit (o 0) no se pagina (compatibilidad con clientes actuales).
 */
export const parsePagination = (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const rawLimit = parseInt(query.limit, 10);
    const limit =
        Number.isFinite(rawLimit) && rawLimit > 0
            ? Math.min(100, rawLimit)
            : null;

    return {
        page,
        limit,
        skip: limit ? (page - 1) * limit : 0,
        paginated: Boolean(limit),
    };
};

export const buildPaginatedMeta = ({ page, limit, total }) => {
    if (!limit) {
        return { total, page: 1, limit: total, totalPages: 1 };
    }

    return {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
};
