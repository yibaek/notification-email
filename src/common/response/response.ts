import { isObject } from 'type-guards';

export async function ok(data: any, message?: string) {
  if (isObject(data) && 'then' in data) {
    data = await data;
  }

  return {
    status: 200,
    data,
  };
}

export async function failure(data: any, message = '', status = 400) {
  if (isObject(data) && 'then' in data) {
    data = await data;
  }

  return {
    status,
    message,
    data,
  };
}
