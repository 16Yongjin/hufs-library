const rq = require('request-promise')
const cheerio = require('cheerio')
const uri = 'http://library.hufs.ac.kr/search/Search.Result.Export.ax'

const cids = ['1832467', '1827290', '1824731', '1819424', '1807737', '1752689', '1752688', '1737954', '1641696', '1482984']

const getCidBody = cids => {
  const cidUri = encodeURIComponent(cids.join('|'))
  return `cids=${cidUri}&opt=5&method=screen&optItem=1&methods=screen&viewCount=100`
}

const getOptions = cids => ({
  method: 'POST',
  uri,
  body: getCidBody(cids),
  headers: {
    Host: 'library.hufs.ac.kr',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache'
  }
})

const keys = { 
  '서명/저자': 'title',
  '개인저자': 'author',
  ISBN: 'ISBN',
  '청구기호': 'code' 
}

const bookDetails = async (cids) => {
  try {
    const body = await rq(getOptions(cids))
    const $ = cheerio.load(body)
    const res = []
    $('body li.detail').each((idx, tds) => {
      const detail = $(tds)
        .text()
        .replace(/\t|   +| (?=\n)/g, '')
        .split('\n')
        .filter(s => s.includes(' : '))
        .map(s => s.split(' : '))
        .reduce((acc, v)  => (keys[v[0]] ? (acc[keys[v[0]]] = v[1].trim(), acc) : acc), {})
      
      if(detail.title) {
        const [title, author] = detail.title.split(' / ')
        detail.title = title
        if (author) { detail.author = author.replace(';', '/') }
      }
      res.push(detail)
    })
    return res
  } catch (e) {
    console.log(e)
    return []
  }
}
  
// bookDetails(cids).then(console.log)

const bookDetail = cid => bookDetails([cid]).then(b => b[0])

// bookDetail('1832467').then(console.log)

const getISBNs = async (cids) => {
  const body = await rq(getOptions(cids))
  const $ = cheerio.load(body)

  const ISBNs = []
  $('body li.detail').each((idx, tds) => {
    const ISBN = $(tds).text().match(/ISBN : (\d+)/)[1]
    ISBNs.push(ISBN)
  })
  return ISBNs
}

// getISBNs(cids)

const getOneISBN = async (cid) => {
  const ISBN = await getISBNs([cid])
  return ISBN[0]
}

// getOneISBN('1832467').then(console.log)

module.exports = { bookDetail, bookDetails, getISBNs, getOneISBN }
