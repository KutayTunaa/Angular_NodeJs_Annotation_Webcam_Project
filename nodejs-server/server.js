const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors')


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


// Endpoint to save photo
app.post('/save-photo', (req, res) => {
  const base64Data = req.body.photoData.replace(/^data:image\/png;base64,/, "");
  const filename = `photo_${Date.now()}.png`;
  
  fs.writeFile(filename, base64Data, 'base64', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error saving photo' });
    } else {
      res.status(200).send({ message: 'Photo saved successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
