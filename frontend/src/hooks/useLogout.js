import { useAuthContext } from "./useAuthContext"
import { useCitationsContext } from "./useCitationsContext"

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    const { dispatch: dispatchCitations } = useCitationsContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({ type: 'LOGOUT' })
        dispatchCitations({ type: 'SET_CITATIONS', payload: null })
    }

    return { logout }
}