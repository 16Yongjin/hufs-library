const { searchBooks, bookDetail, bookDetails, getISBNs, getOneISBN, searchBarcode } = require('../api')

module.exports = app => {
  app.get('/search', async (req, res) => {
    const { query, page, size } = req.query
    const books = await searchBooks(query, page, size)
    res.send(books)
  })

  app.get('/detail/:id', async (req, res) => {
    const { id } = req.params
    const detail = await bookDetail(id)
    detail ? res.send(detail) : res.status(404).send('Book not found')
  })

  app.get('/barcode/:code', async (req, res) => {
    const { code } = req.params
    const book =  await searchBarcode(code)
    book ? res.send(book) : res.status(404).send('Book not found')
  })
}