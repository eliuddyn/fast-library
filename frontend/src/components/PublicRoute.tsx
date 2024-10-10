import { Navigate, Outlet } from 'react-router-dom'
import useFastLibraryStore from '@/store/user'

export const PublicRoute = () => {

    const userSession = useFastLibraryStore((state) => state.userSession)

    return userSession === null ? <Outlet /> : localStorage.getItem('flUserRole') as string === 'Admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/libros" />
}
