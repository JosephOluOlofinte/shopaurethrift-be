import express from 'express';

const app = express();

app.get('/', (req, res) => {
  return res.send('Health OK');
});

app.listen(4040, () => {
  console.log('Test server running on port 4040');
});
