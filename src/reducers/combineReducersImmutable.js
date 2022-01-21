// defaultState is the expected initial state when feeding values in.
// reducers are reducers with names matching the keys to be used in the
// final state.
const combineReducersImmutable = (defaultState, reducers) => {
    const reducerKeys = Object.keys(reducers);  
    return (inputState = defaultState, action) => {
      return inputState.withMutations(s => {
        reducerKeys.forEach(reducerName => {
          const reducer = reducers[reducerName];
          const prevDomainState = inputState.get(reducerName);
          const nextDomainState = reducer(prevDomainState, action);
          s.set(reducerName, nextDomainState);
        });
      });
    };
  };
  
  export default combineReducersImmutable;
  