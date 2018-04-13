const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())
require('./routes/booksRoutes')(app)

app.listen(PORT, () => console.log(`Listening on port`, PORT))
