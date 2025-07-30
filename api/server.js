const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clients', require('./routes/clients'));
app.use('/api/transactions', require('./routes/transactions'));

app.use('/api/categories', require('./routes/categories'));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API prête sur http://localhost:${PORT}`);
});
