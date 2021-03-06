export * as localStorage from './localStorage.js';

export function spaces(me, graph) {
  id = guesstimateId(me)
  if (id) {
    return graph.guesstimates.filter(g => g.user == id)
  }
}

export function guesstimateId(me) {
  return _.get(me, 'profile.user_metadata.guesstimateId')
}
