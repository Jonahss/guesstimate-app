export default function guesstimates(state = [], action) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    let newGuesstimates = _.flatten(action.records.map(e => _.get(e, 'graph.guesstimates'))).filter(e => e)
    return [...state, ...newGuesstimates]
  case 'ADD_METRIC':
    return [...state, {metric: action.item.id, input: ''}]
  case 'REMOVE_METRIC':
    return state.filter(y => y.metric !== action.item.id)
  case 'CHANGE_GUESSTIMATE':
    const i = state.findIndex(y => y.metric === action.values.metric);
    if (i !== -1) {
      return [
        ...state.slice(0, i),
        action.values,
        ...state.slice(i+1, state.length)
      ];
    }
  default:
    return state;
  }
}

