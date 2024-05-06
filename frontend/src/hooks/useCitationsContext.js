import { CitationsContext } from '../context/CitationContext'
import { useContext } from 'react'

export const useCitationsContext = () => {
  const context = useContext(CitationsContext)

  if (!context) {
    throw Error('useCitationsContext must be used inside an CitationsContextProvider')
  }

  return context
}