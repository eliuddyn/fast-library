/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from "@tanstack/react-table";
import MyTable from '@/components/MyTable'
import { SquarePen, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
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
import PageHeader from '@/components/PageHeader';
import upperCaseFunction from '@/customFunctions/upperCaseFunction'
import { Usuario } from '@/types/myTypes';
import { cn } from '@/lib/utils';

const librarianFormSchema = z.object({
    names: z.string({ required_error: "Requerido" }).min(2, { message: "Mínimo 2 caracteres" }),
    lastnames: z.string({ required_error: "Requerido" }).min(2, { message: "Mínimo 2 caracteres" }),
    gender: z.string({ required_error: "Requerido" }).min(1, 'Requerido'),
    email: z.string({ required_error: "Requerido" }).email({ message: "Correo inválido" }),
    password: z.string({ required_error: "Requerido" }).min(8, 'Mínimo 8 caracteres'),
})

const genderList = [
    { name: 'MASCULINO', value: 'M' },
    { name: 'FEMENINO', value: 'F' },
]

const librarians = [
    { id: '1', nombres: 'ANABEL MELISSA', apellidos: 'GUEVARA MUÑOZ', genero: 'F', email: 'anabelmGuevara@gmail.com', role: 'BIBLIOTECARIO' },
    { id: '2', nombres: 'MARCOS GABRIEL', apellidos: 'SOSA PAREDES', genero: 'M', email: 'gabrielmarcosSP@gmail.com', role: 'BIBLIOTECARIO' },
    { id: '3', nombres: 'YULISSA', apellidos: 'RODRIGUEZ VIZCAINO', genero: 'F', email: 'yulissaRodriguezv@gmail.com', role: 'BIBLIOTECARIO' },
    { id: '4', nombres: 'ANTONIO', apellidos: 'SANTOS PEREZ', genero: 'M', email: 'santosperezA@gmail.com', role: 'BIBLIOTECARIO' },
]

const LibrariansPage = () => {

    const [allTheLibrarians, setAllTheLibrarians] = useState<Usuario[] | null>(null);
    const [selectedLibrarian, setSelectedLibrarian] = useState<Usuario | null>(null);
    const [selectedLibrarianToDelete, setSelectedLibrarianToDelete] = useState<Usuario | null>(null);
    const [theGenders, setTheGenders] = useState<any>([]);
    const [isUpdateActive, setIsUpdateActive] = useState<boolean | undefined>(false);
    const [isSheetOpened, setIsSheetOpened] = useState<boolean>(false);
    const [canBeDeletedDialog, setCanBeDeletedDialog] = useState<boolean>(false);

    const formToCreateLibrarian = useForm<z.infer<typeof librarianFormSchema>>({
        resolver: zodResolver(librarianFormSchema),
        mode: "onSubmit",
        defaultValues: {
            names: '',
            lastnames: '',
            gender: '',
            email: '',
            password: '',
        },
    });

    const columns: ColumnDef<Usuario[] | any>[] = [
        {
            accessorKey: "thePosition",
            header: "#",
            cell: ({ row }) => (
                <span className='font-medium'>{row.index + 1}</span>
            ),
        },
        {
            accessorKey: "picture",
            header: "Foto",
            cell: ({ row }) => (
                <div className='flex items-center'>
                    <Avatar>
                        <AvatarImage src={row?.original?.picture ?? undefined} alt="Foto" />
                        <AvatarFallback className={cn(
                            row?.original?.genero === 'M' ? 'bg-blue-600' : 'bg-pink-600',
                            'text-gray-100'
                        )}>
                            <span className='grid grid-cols-1 justify-items-center'>
                                {/* NAMES */}
                                <span className="text-sm font-semibold leading-3">
                                    {row?.original?.nombres && row?.original?.nombres?.split(" ")?.map((name: string) =>
                                        <span key={name}>{name[0][0]}</span>
                                    )}
                                </span>

                                {/* LASTNAMES */}
                                <span className="text-sm font-semibold leading-4">
                                    {row?.original?.apellidos && row?.original?.apellidos?.split(" ")?.map((lastname: string) =>
                                        <span key={lastname}>{lastname[0][0]}</span>
                                    )}
                                </span>
                            </span>
                        </AvatarFallback>
                    </Avatar>
                </div>
            ),
        },
        {
            accessorKey: "nombres",
            header: "Nombres",
            cell: ({ row }) => (
                <span className='text-gray-700 font-semibold'>{row?.original?.nombres}</span>
            ),
        },
        {
            accessorKey: "apellidos",
            header: "Apellidos",
            cell: ({ row }) => (
                <span className='text-gray-700 font-semibold'>{row?.original?.apellidos}</span>
            ),
        },
        {
            accessorKey: "genero",
            header: "Género",
            cell: ({ row }) => (
                <span className={cn(
                    row?.original?.genero === 'M' ? 'text-blue-600' : 'text-pink-600',
                    'text-xs font-bold'
                )}>
                    {row?.original?.genero}
                </span>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <span className='font-semibold text-xs text-gray-800'>{row?.original?.email}</span>
            ),
        },
        {
            accessorKey: "actions",
            header: "Acciones",
            cell: ({ row }) => (
                <div className='flex gap-3'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className='rounded-lg h-8 w-8 bg-blue-500 hover:bg-blue-600'
                                    onClick={() => fillLibrarianToUpdate(row?.original)}
                                >
                                    <span><SquarePen className="h-6 w-6 text-white" /></span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className='rounded-lg h-8 w-8 bg-rose-500 hover:bg-red-600'
                                    onClick={() => fillLibrarianToDelete(row?.original)}
                                    disabled={isUpdateActive}
                                >
                                    <span><Trash2 className="h-6 w-6" /></span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    useEffect(() => {
        getAllLibrarians();
        setTheGenders(genderList)
    }, [])

    const getAllLibrarians = async () => {

        setAllTheLibrarians(librarians)
    }

    async function createLibrarian(values: z.infer<typeof librarianFormSchema>) {

        const myLibrarian = {
            nombres: upperCaseFunction(values?.names),
            apellidos: upperCaseFunction(values?.lastnames),
            genero: upperCaseFunction(values?.gender),
            email: values?.email,
            password: values?.password,
            role: 'BIBLIOTECARIO'
        }

        //console.log(myLibrarian)

        try {
            console.log(myLibrarian)
            // await db.categories.create(myCategory)
            //getAllLibrarians()
            //clearLibrarianForm()

        } catch (error) {
            console.log(error)
        }
    }

    const fillLibrarianToUpdate = (theLibrarian: any) => {

        formToCreateLibrarian?.setValue('names', theLibrarian?.nombres);
        formToCreateLibrarian?.setValue('lastnames', theLibrarian?.apellidos);
        formToCreateLibrarian?.setValue('gender', theLibrarian?.genero);
        formToCreateLibrarian?.setValue('email', theLibrarian?.email);

        setSelectedLibrarian(theLibrarian)
        setIsUpdateActive(true)
        setIsSheetOpened(true)
    }

    async function updateLibrarian(values: z.infer<typeof librarianFormSchema>) {

        //setLoading(true)

        let theNames: any = null
        let theLastnames: any = null
        let theGender: any = null
        let theEmail: any = null
        let thePassword: any = null

        if (selectedLibrarian?.nombres !== values?.names) {
            theNames = { nombres: upperCaseFunction(values?.names) }
        }

        if (selectedLibrarian?.apellidos !== values?.lastnames) {
            theLastnames = { apellidos: upperCaseFunction(values?.lastnames) }
        }

        if (selectedLibrarian?.genero !== values?.gender) {
            theGender = { genero: upperCaseFunction(values?.gender), }
        }

        if (selectedLibrarian?.email !== values?.email) {
            theEmail = { email: values?.email }
        }

        if (selectedLibrarian?.password !== values?.password) {
            thePassword = { password: upperCaseFunction(values?.password) }
        }

        const myLibrarian = {
            ...theNames,
            ...theLastnames,
            ...theGender,
            ...theEmail,
            ...thePassword
        }

        console.log(myLibrarian)

        try {
            // await db.categories.update(selectedCategory?.$id, myCategory);
            getAllLibrarians()
            clearLibrarianForm()
        } catch (error) {
            console.log(error)
        }
    }

    const fillLibrarianToDelete = (theLibrarian: any) => {

        setSelectedLibrarianToDelete(theLibrarian)
        setCanBeDeletedDialog(true)
    }

    const deleteLibrarian = async (LibrarianID: string | undefined) => {

        console.log(LibrarianID)
        //await db.categories.delete(categoryID)
        //getAllLibrarians()
        //clearLibrarianForm()
    }

    const clearLibrarianForm = () => {
        setIsSheetOpened(false)
        formToCreateLibrarian?.reset();
        setIsUpdateActive(false)
        setSelectedLibrarian(null)
        setCanBeDeletedDialog(false)
        setSelectedLibrarianToDelete(null)
    }

    return (
        <>
            <PageHeader pageName="Bibliotecarios" />

            <div className="pt-4 flex items-center justify-end">
                <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">

                    {/* LIBRARIAN FORM */}
                    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
                        <SheetTrigger asChild>
                            <Button variant="default" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                Agregar Bibliotecario
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            onInteractOutside={event => event.preventDefault()}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            className='bg-slate-300 dark:bg-gray-800 w-full sm:max-w-md overflow-y-auto'
                            side="right"
                        >
                            <SheetHeader className='pt-4 pl-3 pb-3 bg-slate-800'>
                                <SheetTitle className='text-gray-200 text-2xl text-center'>
                                    {isUpdateActive ?
                                        <span className='text-amber-400 text-xl'>{selectedLibrarian?.nombres}</span>
                                        :
                                        'Agregar Bibliotecario'
                                    }
                                </SheetTitle>
                                <SheetDescription className='text-gray-200 text-base text-center'>
                                    {isUpdateActive ? selectedLibrarian?.genero === 'M' ? 'Actualiza este bibliotecario' : 'Actualiza esta bibliotecaria' : ''}
                                </SheetDescription>
                            </SheetHeader>
                            <Form {...formToCreateLibrarian}>
                                <form className='p-4' onSubmit={formToCreateLibrarian?.handleSubmit(isUpdateActive ? updateLibrarian : createLibrarian)}>

                                    <div className="grid gap-6">

                                        {/* NAMES */}
                                        <FormField
                                            control={formToCreateLibrarian?.control}
                                            name="names"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base text-gray-900 font-bold'>Nombres</FormLabel>
                                                    <FormControl>
                                                        <Input autoComplete='off' className='uppercase font-medium' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-600' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* LASTNAMES */}
                                        <FormField
                                            control={formToCreateLibrarian?.control}
                                            name="lastnames"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base text-gray-900 font-bold'>Apellidos</FormLabel>
                                                    <FormControl>
                                                        <Input autoComplete='off' className='uppercase font-medium' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-600' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* GENDER */}
                                        <FormField
                                            control={formToCreateLibrarian?.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base text-gray-900 font-bold'>Género</FormLabel>
                                                    <Select onValueChange={(e) => field.onChange(e)} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="w-full h-10 font-medium dark:text-gray-700 bg-background dark:bg-slate-300">
                                                                <SelectValue placeholder='Selecciona tu género' />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="max-h-[--radix-select-content-available-height]">
                                                            {theGenders.map((gender: any) => (
                                                                <SelectItem key={gender?.value as string} value={gender?.value as string}>
                                                                    {gender?.name as string}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className='text-red-600' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* EMAIL */}
                                        <FormField
                                            control={formToCreateLibrarian?.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base text-gray-900 font-bold'>Email</FormLabel>
                                                    <FormControl>
                                                        <Input autoComplete='off' className='font-medium' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-600' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* PASSWORD */}
                                        <FormField
                                            control={formToCreateLibrarian?.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-base text-gray-900 font-bold'>Contraseña</FormLabel>
                                                    <FormControl>
                                                        <Input type='password' className='uppercase font-medium' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-600' />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='pt-8 grid grid-flow-col justify-stretch gap-4'>
                                        <SheetClose asChild>
                                            <Button type="button" className='bg-rose-500 hover:bg-red-500 font-bold text-gray-100 dark:text-gray-100' onClick={clearLibrarianForm}>Cancelar</Button>
                                        </SheetClose>
                                        <Button type="submit" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                            {isUpdateActive ? 'Actualizar' : 'Crear Categoría'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>

            {
                allTheLibrarians && allTheLibrarians.length === 0 ? (<div
                    className="flex flex-1 items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            No tienes bibliotecarios
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Agrega un bibliotecario para la biblioteca.
                        </p>
                    </div>
                </div>
                ) : (
                    <MyTable myData={allTheLibrarians} myColumns={columns} rowsName={allTheLibrarians?.length === 1 ? 'Bibliotecario' : 'Bibliotecarios'} />
                )
            }

            {/* CAN BE DELETED ALERTDIALOG */}
            <AlertDialog open={canBeDeletedDialog} onOpenChange={setCanBeDeletedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl text-red-700 text-center'>{selectedLibrarianToDelete?.nombres}</AlertDialogTitle>
                        <AlertDialogDescription className='flex flex-col text-base text-gray-900 text-center'>
                            <span className='text-base font-bold'>
                                {selectedLibrarian?.genero === 'M' ? 'Se eliminará este bibliotecario' : 'Se eliminará esta bibliotecaria'}
                            </span>

                            {/* <span>
                                <span className='text-sm text-red-600 font-bold'>{selectedCategoryToDelete?.sub_categories?.join(', ')}</span>
                            </span> */}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-blue-500 hover:bg-blue-600 text-gray-100 hover:text-gray-100 font-bold'>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className='bg-rose-500 hover:bg-red-600 font-bold' onClick={() => deleteLibrarian(selectedLibrarianToDelete?.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default LibrariansPage