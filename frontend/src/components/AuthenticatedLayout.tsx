/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { adminNavigation, librarianNavigation } from '@/lib/routes'
import { cn } from '@/lib/utils'
import useFastLibraryStore from '@/store/user'
import logo from '@/assets/logo.png'

const AuthenticatedLayout = () => {

    const navigate = useNavigate();
    const userSession = useFastLibraryStore((state) => state.userSession)
    const setUserSession = useFastLibraryStore((state) => state.setUserSession)
    const [currentNavigation, setCurrentNavigation] = useState<any[]>([]);
    const [isSheetOpened, setIsSheetOpened] = useState<boolean>(false);
    const [alertDialogForLogout, setAlertDialogForLogout] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {

        console.log(userSession)
        if (userSession && userSession.role === 'ADMIN') {
            setCurrentNavigation(adminNavigation)
        }

        if (userSession && userSession.role === 'BIBLIOTECARIO') {
            setCurrentNavigation(librarianNavigation)
        }
    }, [userSession])

    const logoutUser = async () => {
        setUserSession(null);
        localStorage.removeItem('flUserRole')
        navigate('/')
    }

    return (
        <>
            <div className="grid w-full lg:grid-cols-[250px_1fr]">

                {/* DESTKOP SIDEBAR */}
                <div className="hidden border-r border-gray-700 bg-slate-800 lg:block h-screen sticky top-0">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex items-center justify-center px-4 pt-3">
                            <div className="flex flex-col items-center py-1.5">

                                <img
                                    className="mx-auto rounded-xl"
                                    width={88}
                                    height={88}
                                    src={logo}
                                    alt="Logo"
                                />

                                <span className="pt-2 text-2xl text-gray-100 font-bold">Fast Library</span>
                            </div>
                        </div>

                        <div className="flex-1 border-t border-gray-600">
                            <nav className="grid gap-3 items-start px-3 py-9 text-lg font-medium">
                                {currentNavigation.map((item) => (
                                    <Link
                                        key={item.title}
                                        to={item.url}
                                        className={cn(
                                            item.url === location.pathname ? 'text-white bg-blue-600' : 'text-gray-200 hover:text-amber-400',
                                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* MOBILE SIDEBAR */}
                <div className="flex flex-col">
                    <header className="flex h-16 items-center gap-4 border-b bg-slate-800 px-4">
                        <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 lg:hidden"
                                >
                                    <Menu className="h-5 w-5 text-gray-900" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col bg-slate-800 border border-transparent focus:outline-none">

                                <SheetTitle></SheetTitle>
                                <SheetDescription></SheetDescription>
                                <div className="flex items-center justify-center px-4 border-b border-gray-600">
                                    <div className="flex flex-col items-center py-4">

                                        <img
                                            className="mx-auto rounded-xl"
                                            width={88}
                                            height={88}
                                            src={logo}
                                            alt="Logo"
                                        />

                                        <span className="pt-7 text-2xl text-gray-100 font-bold">Fast Library</span>
                                    </div>
                                </div>

                                <nav className="grid gap-3 text-xl font-medium px-4 pt-5">
                                    {currentNavigation.map((item) => (
                                        <Link
                                            key={item.title}
                                            to={item.url}
                                            onClick={() => setIsSheetOpened(false)}
                                            className={cn(
                                                item.url === location.pathname ? 'text-white bg-blue-600' : 'text-gray-200 hover:text-amber-400',
                                                "flex items-center gap-4 rounded-xl px-3 py-2 transition-all"
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.title}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <div className="w-full flex items-center justify-end">

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className='cursor-pointer h-10 w-10'>
                                        <Avatar>
                                            <AvatarImage src={undefined} alt="Foto" />
                                            <AvatarFallback className={cn(
                                                userSession && userSession.role === 'ADMIN' ? 'bg-amber-400 text-gray-900' : 'bg-blue-600 text-gray-100',
                                                'font-bold'
                                            )}>
                                                <span className='grid grid-cols-1 justify-items-center'>
                                                    {/* NAMES  */}
                                                    <span className="text-sm leading-4">
                                                        {userSession?.nombres && userSession?.nombres?.split(" ")?.map((name: string) =>
                                                            <span key={name}>{name[0][0]}</span>
                                                        )}
                                                    </span>

                                                    {/* LASTNAMES  */}
                                                    <span className="text-sm leading-4">
                                                        {userSession?.apellidos && userSession?.apellidos?.split(" ")?.map((lastname: string) =>
                                                            <span key={lastname}>{lastname[0][0]}</span>
                                                        )}
                                                    </span>
                                                </span>
                                            </AvatarFallback>
                                        </Avatar>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className='text-center text-base'>Acciones</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='cursor-pointer'>
                                        <button
                                            className='w-full text-base text-center text-red-700 font-bold'
                                            onClick={() => setAlertDialogForLogout(true)}
                                        >
                                            Salir
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    <main className="bg-slate-300 flex flex-1 flex-col gap-4 p-3 lg:gap-6 lg:p-6">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* LOGOUT ALERTDIALOG */}
            <AlertDialog open={alertDialogForLogout} onOpenChange={setAlertDialogForLogout}>
                <AlertDialogContent className='bg-gray-300 border border-gray-600 flex flex-col items-center justify-between'>
                    <AlertDialogHeader className=''>
                        <AlertDialogTitle className='text-gray-800 text-2xl text-center'>¿Está seguro de salir?</AlertDialogTitle>
                        <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className='bg-blue-900 hover:bg-blue-800 text-gray-100 hover:text-gray-100 font-bold'
                        >
                            NO
                        </AlertDialogCancel>
                        <AlertDialogAction className='bg-red-500 hover:bg-rose-600 font-bold' onClick={() => logoutUser()}>SALIR</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AuthenticatedLayout