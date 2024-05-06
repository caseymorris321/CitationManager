import { useEffect } from 'react'
import { useCitationsContext } from "../hooks/useCitationsContext"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import CitationDetails from '../components/CitationDetails'
import CitationForm from '../components/CitationForm'

const Home = () => {
  const { citations, dispatch } = useCitationsContext()
  const { user } = useAuthContext()

  useEffect(() => {
    const fetchCitations = async () => {
      const response = await fetch('/api/citations', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_CITATIONS', payload: json })
      }
    }

    if (user) {
      fetchCitations()
    }
  }, [dispatch, user])

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9 col-12 order-2 order-md-1">
          {citations && citations.map((citation) => (
            <CitationDetails key={citation._id} citation={citation} />
          ))}
        </div>
        <div className="col-md-3 col-12 order-1 order-md-2">
          <CitationForm />
        </div>
      </div>
    </div>
  )
}

export default Home