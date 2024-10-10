import { Navigate, Outlet } from 'react-router-dom'

import useFastLibraryStore from '@/store/user';

export const ProtectedRoute = () => {

    const userSession = useFastLibraryStore((state) => state.userSession)

    //return userSession === null ? <Navigate to="/" /> : localStorage.getItem('flUserRole') as string === 'Admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/autores" />
    return userSession !== null ? <Outlet /> : <Navigate to="/" />
}
