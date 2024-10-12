/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { Usuario } from '@/types/myTypes';
import useFastLibraryStore from '@/store/user';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import logo from '@/assets/logo.png'

const LoginSchema = z.object({
    email: z.string({ required_error: "Requerido" }).email({ message: "Correo inválido" }),
    password: z.string({ required_error: "Requerido" }),
})

const LoginPage = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false);
    const [role, setRole] = useState<string>('');
    const [isValidCredentials, setIsValidCredentials] = useState<boolean>(false);
    const setUserSession = useFastLibraryStore((state: any) => state.setUserSession)

    const userLoginForm = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const addUserToInputs = (role: string) => {

        if (role === 'ADMIN') {
            setRole('ADMIN')
            userLoginForm?.setValue('email', 'eliuddy@hotmail.com')
            userLoginForm?.setValue('password', '12345678')
        }

        if (role === 'BIBLIOTECARIO') {
            setRole('BIBLIOTECARIO')
            userLoginForm?.setValue('email', 'amdcore@hotmail.com')
            userLoginForm?.setValue('password', '12345678')
        }
    }

    async function loginTheUser(values: z.infer<typeof LoginSchema>) {

        setLoading(true)

        console.log(role)
        console.log(values)

        if (role === '') {
            setIsValidCredentials(true)
            setLoading(false)
        } else if (role === 'ADMIN') {

            const myAdmin: Usuario = {
                id: '5245-6359-6548',
                nombres: 'SUPER',
                apellidos: 'ADMIN',
                genero: 'M',
                email: values.email,
                role: role
            }

            localStorage.setItem('flUserRole', role);
            setUserSession(myAdmin)
            navigate('/admin-dashboard')

        } else if (role === 'BIBLIOTECARIO') {

            const myLibrarian: Usuario = {
                id: '2298-3021-8851',
                nombres: 'JUAN',
                apellidos: 'MATEO SOLANO',
                genero: 'M',
                email: values.email,
                role: role
            }

            localStorage.setItem('flUserRole', role);
            setUserSession(myLibrarian)
            navigate('/libros')
        }


        // Buscar en la base de datos por email

    }

    return (
        <>
            <div className='min-h-screen grid grid-rows-[auto]'>
                <div className="bg-gradient-to-b from-sky-600 via-gray-400 to-amber-100 h-full flex items-center justify-center sm:items-start sm:pt-32 px-4 ">
                    <Card className="mx-auto w-96">
                        <CardHeader className='flex items-center justify-center'>

                            <img
                                className="mx-auto rounded-xl"
                                width={100}
                                height={100}
                                src={logo}
                                alt="Logo"
                            />

                            <CardTitle className="text-3xl pt-6">Inicia sesión</CardTitle>
                            <CardDescription>
                                Accede con tus credenciales.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...userLoginForm}>
                                <form onSubmit={userLoginForm.handleSubmit(loginTheUser)}>

                                    <div className="grid grid-cols-1 gap-4">

                                        {/* EMAIL */}
                                        <FormField
                                            control={userLoginForm.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base font-bold text-[#143a63]'>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type='email' className='font-medium text-lg focus-visible:ring-[#143a63]' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* PASSWORD */}
                                        <FormField
                                            control={userLoginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base font-bold text-[#143a63]'>Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' className='font-medium text-lg focus-visible:ring-[#143a63]' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='pt-8 grid grid-cols-2 justify-strech gap-1'>
                                        <Button type="button" className='bg-amber-300 hover:bg-amber-400 text-base font-bold text-black' onClick={() => addUserToInputs('ADMIN')}>Admin</Button>
                                        <Button type="button" className='bg-red-500 hover:bg-red-600 text-base font-bold' onClick={() => addUserToInputs('BIBLIOTECARIO')}>Bibliotecario</Button>
                                        {/* <Button type="button" className='bg-blue-500' onClick={() => addUserToInputs('CLIENTE 2')}>Cliente 2</Button> */}
                                        {/* <Button type="button" className='bg-red-500' onClick={() => addUserToInputs('DELETE')}>Borrar</Button> */}
                                    </div>

                                    <div className='pt-8 grid grid-flow-col justify-strech gap-4'>
                                        <Button
                                            type="submit"
                                            className='bg-[#143a63] hover:bg-blue-800 text-lg'
                                            disabled={loading}
                                        >
                                            {loading ?
                                                <>
                                                    <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                                                        </path>
                                                    </svg>
                                                    Verificando...
                                                </>
                                                :
                                                'Acceder'
                                            }
                                        </Button>

                                        {/* <Button
                                            variant='destructive'
                                            className='text-lg text-white'
                                            disabled={loading}
                                            onClick={() => logoutUser()}
                                        >
                                            LOGOUT
                                        </Button> */}
                                    </div>

                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* INVALID CREDENTIALS ALERT DIALOG */}
            <AlertDialog open={isValidCredentials} onOpenChange={setIsValidCredentials}>
                <AlertDialogContent className='mx-2'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-red-700 text-xl sm:text-2xl'>Credenciales Incorrectas!</AlertDialogTitle>
                        <AlertDialogDescription className='text-base font-medium text-gray-900'>
                            Verifique sus credenciales para acceder a la plataforma.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>

                        <AlertDialogCancel className='bg-[#143a63] hover:bg-black text-gray-100 hover:text-gray-100'>
                            Entendido
                        </AlertDialogCancel>

                        {/* <AlertDialogAction className='bg-red-500' onClick={() => deleteDepartment(departmentToDelete?.id)}>Eliminar</AlertDialogAction> */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default LoginPage