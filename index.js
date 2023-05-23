const server = require("./server");
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const mongoURL = process.env.MONGO_CONNECTION_STRING || 'mongodb+srv://api:FMc2Li3ViIhH7iHG@cluster0.1vnkun2.mongodb.net/?retryWrites=true&w=majority'

//mongodb+srv://api:FMc2Li3ViIhH7iHG@cluster0.1vnkun2.mongodb.net/?retryWrites=true&w=majority
//'mongodb://127.0.0.1:27017/mongodb?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0'

mongoose.connect(mongoURL, {}).then(() => {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
});