import { createContext, useReducer } from "react";

export const CitationsContext = createContext();

export const citationsReducer = (state, action) => {
  switch (action.type) {
    case "SET_CITATIONS":
      return {
        ...state,
        citations: action.payload || [],
      };

    case "CREATE_CITATION":
      return {
        ...state,
        citations: [action.payload, ...state.citations],
      };
    case "DELETE_CITATION":
      return {
        ...state,
        citations: state.citations.filter((w) => w._id !== action.payload._id),
      };
    case "MARK_CITATION_DELETED":
    case "UNDO_DELETE_CITATION":
      case 'UPDATE_CITATION':
        if (action.paylod) {
        return {
          citations: state.citations.map((citation) =>
            citation._id === action.payload._id ? action.payload : citation
          ),
        };
      };
    case "UPDATE_SEARCH_HISTORY":
      return {
        ...state,
        searchHistory: action.payload,
      };
    case "SET_FAVORITES":
      return {
        ...state,
        favorites: action.payload,
      };
    case "SET_FAVORITE":
      return {
        ...state,
        citations: state.citations.map((citation) =>
          citation._id === action.payload
            ? { ...citation, isFavorite: true }
            : citation
        ),
        favorites: [...state.favorites, action.payload],
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        citations: state.citations.map((citation) =>
          citation._id === action.payload
            ? { ...citation, isFavorite: false }
            : citation
        ),
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    default:
      return state;
  }
};

export const CitationsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(citationsReducer, {
    citations: [],
    searchHistory: [],
    favorites: [],
  });

  return (
    <CitationsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CitationsContext.Provider>
  );
};
