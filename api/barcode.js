const rq = require('request-promise')
const cheerio = require('cheerio')

const getUrl = id => `http://library.hufs.ac.kr/search/Search.Result.ax?sid=1&q=IDID:${id}:1&mf=true&qt=등록번호=${id}&qf=${id}&f=&br=01&pageSize=0`
const searchBarcode = async id => {
  const body = await rq(getUrl(id))
  const $ = cheerio.load(body)
  const books = $('div .textArea2Inner .body')

  const res = []
  $(books).each((i, book) => {
    const id = $(book).children('a').attr('href').replace(/\D+/g, '')
    const info = $(book).text().split(/\s\s+/)
    const [, title, author] = info
    const seoul = info.indexOf('서울도서관')
    if (seoul === -1) return
    const [, bracketedCode, available] = info.slice(seoul, seoul+3)
    const code = bracketedCode.slice(1, -1)
    
    res.push({ id, title, author: author.slice(2), code, available })
  })
  // console.log(res)
  return res[0]
}

// searchBarcode(144660)

module.exports = searchBarcode
