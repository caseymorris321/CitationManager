import { createContext, useReducer } from 'react'

export const CitationsContext = createContext()

export const citationsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CITATIONS':
      return {
        citations: action.payload
      }
    case 'CREATE_CITATION':
      return {
        citations: [action.payload, ...state.citations]
      }
    case 'DELETE_CITATION':
      return {
        citations: state.citations.filter((w) => w._id !== action.payload._id)
      }
    case 'MARK_CITATION_DELETED':
      return {
        citations: state.citations.map((citation) =>
          citation._id === action.payload._id ? action.payload : citation),
      }
    case 'UNDO_DELETE_CITATION':
      return {
        citations: state.citations.map((citation) =>
          citation._id === action.payload._id ? action.payload : citation),
      }
    default:
      return state
  }
}

export const CitationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(citationsReducer, {
    citations: null
  })

  return (
    <CitationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CitationsContext.Provider>
  )
}