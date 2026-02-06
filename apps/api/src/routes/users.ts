import { Hono } from 'hono';
import type { ApiResponse, User } from '@loyeo/types';

export const userRoutes = new Hono();

userRoutes.get('/', (c) => {
  const response: ApiResponse<User[]> = {
    success: true,
    data: [],
    meta: {
      page: 1,
      limit: 10,
      total: 0,
    },
  };
  return c.json(response);
});

userRoutes.get('/:id', (c) => {
  const id = c.req.param('id');
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `User with id ${id} not found`,
    },
  };
  return c.json(response, 404);
});

userRoutes.post('/', async (c) => {
  const body = await c.req.json();
  const response: ApiResponse<{ id: string }> = {
    success: true,
    data: {
      id: 'new-user-id',
    },
  };
  return c.json(response, 201);
});
