const url = (query, page, size) => `http://library.hufs.ac.kr/search/Search.Result.ax?sid=1&q=TITL%3A${encodeURIComponent(query)}&eq=&mf=true&f=&br=01&cl=1+2&gr=1&rl=&page=${page}&pageSize=${size}&s=S_PYB&st=DESC&h=&cr=&py=&subj=&facet=Y&nd=&vid=0&tabID=`
const rq = require('request-promise')
const cheerio = require('cheerio')

const searchBooks = async (query, page = 1, size = 10) => {
  try {
    const body = await rq(url(query, page, size))
    const $ = cheerio.load(body)

    const countTitle = $('.searchTitle5').text().match(/\d+/)
    const count = countTitle && parseInt(countTitle[0])
    if (!count || count < (parseInt(page) - 1) * size) {
      return []
    }

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
    return res
  } catch (e) { 
    return []
  }
}

// searchBooks('자바스크립트', 1).then(console.log)

module.exports = searchBooks
