export const formatError = (err: any): string => {
  if (err.constructor.name === 'HttpErrorResponse') {
    return err.error.message;
  }

  if (err.message) {
    return err.message;
  }

  if (err.status && err.statusText) {
    return err.status + ' ' + err.statusText;
  } 

  return err;
};