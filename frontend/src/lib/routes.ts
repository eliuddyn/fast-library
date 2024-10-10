import {
    Home,
    Library,
    Users,
    UsersRound,
    ChartBarStacked
} from "lucide-react"

export const adminNavigation = [
    {
        title: 'Dashboard',
        url: '/admin-dashboard',
        icon: Home,
    },
    {
        title: 'Categorías',
        url: '/categorias',
        icon: ChartBarStacked,
    },
    {
        title: 'Bibliotecarios',
        url: '/bibliotecarios',
        icon: Users,
    }
]

export const librarianNavigation = [
    {
        title: 'Autores',
        url: '/autores',
        icon: UsersRound,
    },
    {
        title: 'Libros',
        url: '/libros',
        icon: Library,
    },
]
