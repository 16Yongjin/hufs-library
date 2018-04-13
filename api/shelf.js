const _ = require('partial-js')
const data = require('./rawData')

_.apList = function(list, ...fns) {
  return fns.map((f, i) => f(list[i]))
}

_.everyAp = function(list, ...fns) {
  return list.length === fns.length &&
         list.map((l, i) => fns[i](l)).every(Boolean)
}

const parseClass = parseFloat

const parseSymbol = char => {
  char = char.charCodeAt(0)
  return char >= 97 ? char - 86 : 
         char >= 65 ? char - 54 :
         char - 48
}

const Num = s => !Number.isNaN(parseFloat(s))

const Char = s => s && !!s.match(/[^1-9]/)

const obj = _.go(
  data,
  _(split, _, /\n\n+/),
  _.map(d => d.split('\n') ),
  _.map(d => d.map((s, i) => i > 0 ? s.split(/ +/) : s )),
  _.reduce((acc, v) => (acc[_.first(v)] = _.rest(v), acc), {})
)

const obj2 = _.mapObject(obj, floors => {
  const res = []
  let floorNum = 1
  let lastNum, startClass, startSymbol, endClass, endSymbol
  for (let floor of floors) {
    const is =_(_.everyAp, floor, ___)
    const ap = _(_.apList, floor, ___)

    if (is(Num, Char, Num, Char)) {
      [ startClass, startSymbol, endClass, endSymbol ] =  ap(parseClass, parseSymbol, parseClass, parseSymbol)
      lastNum = endClass
    } else if (is(Num, Char, Char)) {
      [ startClass, startSymbol, endSymbol ] =  ap(parseClass, parseSymbol, parseSymbol)
      endClass = lastNum = startClass    
    } else if (is(Char, Num, Char)) {
      [ startSymbol, endClass, endSymbol ] = ap(parseSymbol, parseClass, parseSymbol)
      startClass = lastNum
    } else if (is(Char, Char)) {
      [ startSymbol, endSymbol ] = ap(parseSymbol, parseSymbol)
      startClass = endClass = lastNum
    }
    res.push([ floorNum++, startClass, startSymbol, endClass, endSymbol ])
  }
  return res
})

console.log(obj2)