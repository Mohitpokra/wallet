const express = require('express');
const connect = require('./db/index');

// Create express instance
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// mongodb connection
connect();

// Require API routes
const wallet = require('./api/wallet/walletRoute');
const transaction = require('./api/transaction/transactionRoute');

// Import API Routes
app.use('/v1', wallet);
app.use('/v1', transaction);


app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err?.statusCode || 500).json({
    message: err.message || 'Something went wrong'
  });
});

// Export express app
module.exports = app;

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`);
  });
}
