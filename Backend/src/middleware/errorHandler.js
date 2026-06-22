const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details || null
    })
  });
};

module.exports = errorHandler;