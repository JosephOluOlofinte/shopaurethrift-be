export const globalErrorhandler = (err, req, res, next) => {
  // Stack
  const stack = err?.stack;

  // Message
  const message = err?.message;

  res.json({
    stack,
    message,
  });
};
