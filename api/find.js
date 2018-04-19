const _ = require('partial-js')
const shelfs = require('./shelfs')

_.apList = (list, ...fns) => fns.map((f, i) => f(list[i]))

_.filterObject = pred => obj =>
  Object.entries(obj).reduce((acc, [key, val], idx) => 
    pred(val, key, idx) ? (acc[key] = val, acc) : acc, {})

const has = (cl, sy) => shelf => {
  const l = shelf.length - 1 // last
  return ( shelf[0][1] < cl || ( shelf[0][1] == cl && shelf[0][2] <= sy ) ) &&
         ( shelf[l][3] > cl || ( shelf[l][3] == cl && shelf[l][4] >= sy ) )
}

const has2 = (cl, sy) => floor => 
  ( floor[1] < cl || ( floor[1] == cl && floor[2] <= sy ) ) &&
  ( floor[3] > cl || ( floor[3] == cl && floor[4] >= sy) )

const find = shelf => id => {
  const [bookClass, bookSymbol] = _.apList(id.split(' '), parseAlpha, parseBeta)
  return _.go(
    shelfs,
    _.filterObject(has(bookClass, bookSymbol)),
    _.map((floors, index) => ({ index, floors: _.go(floors, _.filter(has2(bookClass, bookSymbol)), _.map(_.first)) }))
  )
}

console.log(
  find(shelfs)('005.278 S123')
)

