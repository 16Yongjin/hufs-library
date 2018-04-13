const _ = require('partial-js')

_.apList = function(list, ...fns) {
  return fns.map((f, i) => f(list[i]))
}

const [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z] =
      [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

const parseAlpha = parseFloat

const parseBeta = char => {
  char = char.charCodeAt(0)
  return char >= 97 ? char - 86 : 
         char >= 65 ? char - 54 :
         char - 48
}

const shelf = 
{
  7: ['1 005.113 S 005.113 Y',
      '2 005.113 Y 005.25 W',
      '3 005.26 B 005.26 S',
      '4 005.26 S 005.268 G',
      '5 005.268 G 005.276 G'],
}

const BookShelf = _.mapObject(shelf, (info, index) => {
  const detail = info.map(i => {
    const [ floor, startAlpha, startBeta, endAlpha, endBeta ] = 
      _.apList(i.split(/\s+/), _.idtt, parseAlpha, parseBeta, parseAlpha, parseBeta)

    return { floor, startAlpha, startBeta, endAlpha, endBeta }
  })
  const { startAlpha, startBeta } = _.first(detail)
  const { endAlpha, endBeta } = _.last(detail)
  const isEmpty = detail.length < 1
  const overview = { index, isEmpty, startAlpha, startBeta, endAlpha, endBeta }
  return { overview, detail }
})

// _.go(
//   BookShelf,
//   _(JSON.stringify, _, null, 2),
//   console.log
// )

const isBookIn = (view, alpha, beta) => 
  ( view.startAlpha < alpha || ( view.startAlpha == alpha && view.startBeta <= beta) ) &&
  ( view.endAlpha   > alpha || ( view.endAlpha   == alpha && view.endBeta   >= beta) )

const find = id => {
  const [alpha, beta] = _.apList(id.split(' '), parseAlpha, parseBeta)
  return _.go(
    BookShelf,
    _.filter(({ overview }) => isBookIn(overview, alpha, beta)),
    _.map(({ overview, detail }) => 
      ({
        index: overview.index,
        floors: _.go(detail, _.filter(_(isBookIn, _, alpha, beta)), _.pluck('floor'))
      }))
  )
}

console.log(
  find('005.268 S123')
)