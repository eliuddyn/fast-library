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
import { Autor } from '@/types/myTypes';


const authorFormSchema = z.object({
    name: z.string({ required_error: "Requerido" }).min(2, { message: "Mínimo 2 caracteres" })
})

const authors = [
    { id: '1', nombre: 'JOAQUIN BALAGUER', libros: 3 },
    { id: '2', nombre: 'JUAN BOSCH', libros: 6 },
    { id: '3', nombre: 'PAULO COELHO', libros: 2 },
    { id: '4', nombre: 'GABRIEL GARCIA MARQUEZ', libros: 1 },
]

const AuthorsPage = () => {

    const [allTheAuthors, setAllTheAuthors] = useState<Autor[] | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Autor | null>(null);
    const [selectedAuthorToDelete, setSelectedAuthorToDelete] = useState<Autor | null>(null);
    const [isUpdateActive, setIsUpdateActive] = useState<boolean | undefined>(false);
    const [isSheetOpened, setIsSheetOpened] = useState<boolean>(false);
    const [canBeDeletedDialog, setCanBeDeletedDialog] = useState<boolean>(false);
    const [canNotBeDeletedDialog, setCanNotBeDeletedDialog] = useState<boolean>(false);

    const formToCreateAuthor = useForm<z.infer<typeof authorFormSchema>>({
        resolver: zodResolver(authorFormSchema),
        mode: "onSubmit",
        defaultValues: {
            name: '',
        },
    });

    const columns: ColumnDef<Autor[] | any>[] = [
        {
            accessorKey: "thePosition",
            header: "#",
            cell: ({ row }) => (
                <span className='font-medium'>{row.index + 1}</span>
            ),
        },
        {
            accessorKey: "nombre",
            header: "Autor",
            cell: ({ row }) => (
                <span className='text-gray-700 font-bold'>{row?.original?.nombre}</span>
            ),
        },
        {
            accessorKey: "Libros",
            header: "Libros",
            cell: ({ row }) => (
                <span className='text-gray-700 font-bold'>{row?.original?.libros}</span>
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
                                    onClick={() => fillAuthorToUpdate(row?.original)}
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
                                    onClick={() => fillAuthorToDelete(row?.original)}
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
        getAllAuthors();
    }, [])

    const getAllAuthors = async () => {

        authors.sort(function (a: any, b: any) {
            if (a?.nombre < b?.nombre) {
                return -1;
            }
            if (a?.nombre > b?.nombre) {
                return 1;
            }
            return 0;
        });

        setAllTheAuthors(authors)
    }

    async function createAuthor(values: z.infer<typeof authorFormSchema>) {

        const myAuthor = {
            nombre: upperCaseFunction(values?.name),
        }

        try {
            console.log(myAuthor)
            // await db.categories.create(myCategory)
            //getAllCategories()
            //clearCategoryForm()

        } catch (error) {
            console.log(error)
        }
    }

    const fillAuthorToUpdate = (theAuthor: any) => {

        formToCreateAuthor?.setValue('name', theAuthor?.nombre);

        setSelectedAuthor(theAuthor)
        setIsUpdateActive(true)
        setIsSheetOpened(true)
    }

    async function updateAuthor(values: z.infer<typeof authorFormSchema>) {

        const myAuthor = {
            nombre: upperCaseFunction(values?.name),
        }



        try {
            console.log(myAuthor)
            // await db.categories.update(selectedCategory?.$id, myCategory);
            //getAllAuthors()
            //clearAuthorForm()
        } catch (error) {
            console.log(error)
        }
    }

    const fillAuthorToDelete = (theAuthor: any) => {

        // Check if this Author has books attached 

        if (theAuthor?.books?.length === 0) {
            setSelectedAuthorToDelete(theAuthor)
            setCanBeDeletedDialog(true)
        } else {
            setSelectedAuthorToDelete(theAuthor)
            setCanNotBeDeletedDialog(true)
        }
    }

    const deleteAuthor = async (authorID: string | undefined) => {

        console.log(authorID)
        //await db.categories.delete(categoryID)
        getAllAuthors()
        clearAuthorForm()
    }

    const clearAuthorForm = () => {
        setIsSheetOpened(false)
        formToCreateAuthor?.reset();
        setIsUpdateActive(false)
        setSelectedAuthor(null)
        setCanNotBeDeletedDialog(false)
        setCanBeDeletedDialog(false)
        setSelectedAuthorToDelete(null)
    }

    return (
        <>
            <PageHeader pageName="Autores" />

            <div className="pt-4 flex items-center justify-end">
                <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">

                    {/* CATEGORY FORM */}
                    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
                        <SheetTrigger asChild>
                            <Button variant="default" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                Agregar Autor
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
                                        <span className='text-amber-400 text-xl'>{selectedAuthor?.nombre}</span>
                                        :
                                        'Agregar Autor'
                                    }
                                </SheetTitle>
                                <SheetDescription className='text-gray-200 text-base text-center'>
                                    {isUpdateActive ? 'Actualiza este autor' : ''}
                                </SheetDescription>
                            </SheetHeader>
                            <Form {...formToCreateAuthor}>
                                <form className='p-4' onSubmit={formToCreateAuthor?.handleSubmit(isUpdateActive ? updateAuthor : createAuthor)}>

                                    <div className="grid gap-6">

                                        {/* NAME */}
                                        <FormField
                                            control={formToCreateAuthor?.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-lg text-gray-900 font-bold'>Nombre</FormLabel>
                                                    <FormControl>
                                                        <Input autoComplete='off' className='uppercase font-medium' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-800' />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className='pt-8 grid grid-flow-col justify-stretch gap-4'>
                                        <SheetClose asChild>
                                            <Button type="button" className='bg-rose-500 hover:bg-red-500 font-bold text-gray-100 dark:text-gray-100' onClick={clearAuthorForm}>Cancelar</Button>
                                        </SheetClose>
                                        <Button type="submit" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                            {isUpdateActive ? 'Actualizar' : 'Crear Autor'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </SheetContent>
                    </Sheet>

                </div>
            </div >

            {
                allTheAuthors && allTheAuthors.length === 0 ? (<div
                    className="flex flex-1 items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            No tienes categorías
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Agrega una categoría para la biblioteca.
                        </p>
                    </div>
                </div>
                ) : (
                    <MyTable myData={allTheAuthors} myColumns={columns} rowsName={allTheAuthors?.length === 1 ? 'Autor' : 'Autores'} />
                )
            }

            {/* CANNOT BE DELETED ALERT DIALOG */}
            <AlertDialog open={canNotBeDeletedDialog} onOpenChange={setCanNotBeDeletedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl text-red-700 text-center'>{selectedAuthorToDelete?.nombre}</AlertDialogTitle>
                        <AlertDialogDescription className='text-base text-gray-900 text-center'>
                            No se puede eliminar esta categoría, porque hay libros que dependen de ella.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-900 hover:bg-blue-900 text-gray-100 hover:text-gray-100'>Entendido</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* CAN BE DELETED ALERTDIALOG */}
            <AlertDialog open={canBeDeletedDialog} onOpenChange={setCanBeDeletedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl text-red-700 text-center'>{selectedAuthorToDelete?.nombre}</AlertDialogTitle>
                        <AlertDialogDescription className='flex flex-col text-base text-gray-900 text-center'>
                            <span className='text-base font-bold'>Se eliminará esta categoría y todas estas Sub-Categorías:</span>

                            {/* <span>
                                <span className='text-sm text-red-800 font-bold'>{selectedCategoryToDelete?.sub_categories?.join(', ')}</span>
                            </span> */}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-blue-500 hover:bg-blue-600 text-gray-100 hover:text-gray-100 font-bold'>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className='bg-rose-500 hover:bg-red-600 font-bold' onClick={() => deleteAuthor(selectedAuthorToDelete?.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AuthorsPage