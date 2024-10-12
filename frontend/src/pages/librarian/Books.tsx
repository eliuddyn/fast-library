/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from "@tanstack/react-table";
import MyTable from '@/components/MyTable'
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import { SquarePen, Trash2, CalendarIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { Libro } from '@/types/myTypes';
import { cn } from '@/lib/utils';
import { CalendarWithMonthYear } from '@/components/CalendarWithMonthYear';
import { MyMultiSelect } from '@/components/MyMultiSelect';

const bookFormSchema = z.object({
    titulo: z.string({ required_error: "Requerido" }).min(2, { message: "Mínimo 2 caracteres" }),
    descripcion: z.string({ required_error: "Requerido" }).min(2, { message: "Mínimo 2 caracteres" }),
    autores: z.array(z.string()).min(1, { message: "Requerido" }),
    categorias: z.array(z.string()).min(1, { message: "Requerido" }),
    fecha_publicacion: z.coerce.date(
        {
            errorMap: ({ code }, { defaultError }) => {
                if (code == 'invalid_date') return { message: 'Requerido' }
                return { message: defaultError }
            }
        }
    ),
})

const authors = [
    { id: '1', nombre: 'JOAQUIN BALAGUER', libros: '3' },
    { id: '2', nombre: 'JUAN BOSCH', libros: '6' },
    { id: '3', nombre: 'PAULO COELHO', libros: '2' },
    { id: '4', nombre: 'GABRIEL GARCIA MARQUEZ', libros: '1' },
]

const categories = [
    { id: '1', nombre: 'FICCIÓN' },
    { id: '2', nombre: 'AVENTURA' },
    { id: '3', nombre: 'ROMANCE' },
    { id: '4', nombre: 'SUSPENSO' },
]

const books = [
    { id: '1', titulo: 'La mente es poderosa', descripcion: 'Aquí conoceremos nuestros pensamientos', autores: ['JOAQUIN BALAGUER', 'PAULO COELHO'], categorias: ['SUSPENSO', 'FICCION'], fecha_publicacion: '2021-04-30' },
    { id: '2', titulo: 'La mente es poderosa', descripcion: 'Aquí conoceremos nuestros pensamientos', autores: ['JOAQUIN BALAGUER', 'PAULO COELHO'], categorias: ['SUSPENSO', 'FICCION'], fecha_publicacion: '2021-04-30' },
    { id: '3', titulo: 'La mente es poderosa', descripcion: 'Aquí conoceremos nuestros pensamientos', autores: ['JOAQUIN BALAGUER', 'PAULO COELHO'], categorias: ['SUSPENSO', 'FICCION'], fecha_publicacion: '2021-04-30' },
    { id: '4', titulo: 'La mente es poderosa', descripcion: 'Aquí conoceremos nuestros pensamientos', autores: ['JOAQUIN BALAGUER', 'PAULO COELHO'], categorias: ['SUSPENSO', 'FICCION'], fecha_publicacion: '2021-04-30' },
]

const BooksPage = () => {

    const [allTheBooks, setAllTheBooks] = useState<Libro[] | null>(null);
    const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
    const [selectedBookToDelete, setSelectedBookToDelete] = useState<Libro | null>(null);
    const [isUpdateActive, setIsUpdateActive] = useState<boolean | undefined>(false);
    const [isSheetOpened, setIsSheetOpened] = useState<boolean>(false);
    const [canBeDeletedDialog, setCanBeDeletedDialog] = useState<boolean>(false);
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDay = new Date().getDate()

    const formToCreateBook = useForm<z.infer<typeof bookFormSchema>>({
        resolver: zodResolver(bookFormSchema),
        mode: "onSubmit",
        defaultValues: {
            titulo: '',
            descripcion: '',
            autores: [],
            categorias: [],
            fecha_publicacion: undefined,
        },
    });

    const columns: ColumnDef<Libro[] | any>[] = [
        {
            accessorKey: "thePosition",
            header: "#",
            cell: ({ row }) => (
                <span className='font-medium'>{row.index + 1}</span>
            ),
        },
        {
            accessorKey: "titulo",
            header: "Título",
            cell: ({ row }) => (
                <span className='text-gray-700 font-bold'>{row?.original?.titulo}</span>
            ),
        },
        {
            accessorKey: "descripcion",
            header: "Descripción",
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='cursor-pointer text-blue-700 font-bold'>Ver Descripción</span>
                        </TooltipTrigger>
                        <TooltipContent className='text-gray-700 font-bold'>
                            {row?.original?.descripcion}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: "autores",
            header: "Autores",
            cell: ({ row }) => (
                <>

                    {row.original?.autores?.length === 1 ? (
                        <>{row.original?.autores[0]?.nombre}</>
                    ) : (
                        <></>
                    )}

                </>
                // <TooltipProvider>
                //     <Tooltip>
                //         <TooltipTrigger asChild>
                //             <span className='cursor-pointer text-blue-700 font-bold'>Ver Autores</span>
                //         </TooltipTrigger>
                //         <TooltipContent className='text-gray-700 font-bold'>
                //             {row.original?.autores?.map((autor: string) => (
                //                 <p key={autor}>{autor}</p>
                //             ))}
                //         </TooltipContent>
                //     </Tooltip>
                // </TooltipProvider>
            ),
        },
        {
            accessorKey: "categorias",
            header: "Categorías",
            cell: ({ row }) => (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='cursor-pointer text-blue-700 font-bold'>Ver Categorías</span>
                        </TooltipTrigger>
                        <TooltipContent className='text-gray-700 font-bold'>
                            {row.original?.categorias?.map((category: string) => (
                                <p key={category}>{category}</p>
                            ))}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ),
        },
        {
            accessorKey: "fecha_publicacion",
            header: "Publicación",
            cell: ({ row }) => (
                <span className='text-gray-700 font-bold'>{row?.original?.fecha_publicacion}</span>
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
                                    onClick={() => fillBookToUpdate(row?.original)}
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
                                    onClick={() => fillBookToDelete(row?.original)}
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
        getAllBooks();
    }, [])

    const getAllBooks = async () => {

        books.sort(function (a: any, b: any) {
            if (a?.titulo < b?.titulo) {
                return -1;
            }
            if (a?.titulo > b?.titulo) {
                return 1;
            }
            return 0;
        });

        setAllTheBooks(books)
    }

    async function createBook(values: z.infer<typeof bookFormSchema>) {

        const myBook = {
            titulo: values?.titulo,
            descripcion: values?.descripcion,
            autores: values?.autores,
            categorias: values?.categorias,
            fecha_publicacion: values?.fecha_publicacion,
        }

        try {
            console.log(myBook)
            // await db.categories.create(myCategory)
            //getAllCategories()
            //clearCategoryForm()

        } catch (error) {
            console.log(error)
        }
    }

    const fillBookToUpdate = (theBook: any) => {

        formToCreateBook?.setValue('titulo', theBook?.titulo);
        formToCreateBook?.setValue('descripcion', theBook?.descripcion);
        formToCreateBook?.setValue('autores', theBook?.autores);
        formToCreateBook?.setValue('categorias', theBook?.categorias);
        formToCreateBook?.setValue('fecha_publicacion', theBook?.fecha_publicacion);

        setSelectedBook(theBook)
        setIsUpdateActive(true)
        setIsSheetOpened(true)
    }

    async function updateBook(values: z.infer<typeof bookFormSchema>) {

        const myBook = {
            titulo: values?.titulo,
            descripcion: values?.descripcion,
            autores: values?.autores,
            categorias: values?.categorias,
            fecha_publicacion: values?.fecha_publicacion,
        }

        try {
            console.log(myBook)
            // await db.categories.update(selectedCategory?.$id, myCategory);
            //getAllAuthors()
            //clearAuthorForm()
        } catch (error) {
            console.log(error)
        }
    }

    const fillBookToDelete = (theBook: any) => {
        setSelectedBookToDelete(theBook)
        setCanBeDeletedDialog(true)
    }

    const deleteBook = async (bookID: string | undefined) => {

        console.log(bookID)
        //await db.categories.delete(categoryID)
        getAllBooks()
        clearBookForm()
    }

    const clearBookForm = () => {
        setIsSheetOpened(false)
        formToCreateBook?.reset();
        setIsUpdateActive(false)
        setSelectedBook(null)
        setCanBeDeletedDialog(false)
        setSelectedBookToDelete(null)
    }

    return (
        <>
            <PageHeader pageName="Libros" />

            <div className="pt-4 flex items-center justify-end">
                <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">

                    {/* CATEGORY FORM */}
                    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
                        <SheetTrigger asChild>
                            <Button variant="default" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                Agregar Libro
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
                                        <span className='text-amber-400 text-xl'>{selectedBook?.titulo}</span>
                                        :
                                        'Agregar Libro'
                                    }
                                </SheetTitle>
                                <SheetDescription className='text-gray-200 text-base text-center'>
                                    {isUpdateActive ? 'Actualiza este libro' : ''}
                                </SheetDescription>
                            </SheetHeader>
                            <Form {...formToCreateBook}>
                                <form className='p-4' onSubmit={formToCreateBook?.handleSubmit(isUpdateActive ? updateBook : createBook)}>

                                    <div className="grid gap-6">

                                        {/* TITLE */}
                                        <FormField
                                            control={formToCreateBook?.control}
                                            name="titulo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm text-gray-900 font-bold'>Título</FormLabel>
                                                    <FormControl>
                                                        <Input autoComplete='off' className='text-base font-medium' {...field} />
                                                    </FormControl>
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* DESCRIPTION */}
                                        <FormField
                                            control={formToCreateBook?.control}
                                            name="descripcion"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm text-gray-900 font-bold'>Descripción</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            autoComplete='off'
                                                            className="resize-none min-h-32 text-base font-medium"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* AUTHORS */}
                                        <FormField
                                            control={formToCreateBook?.control}
                                            name="autores"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm text-gray-900 font-bold'>Autores</FormLabel>
                                                    <MyMultiSelect
                                                        {...field}
                                                        options={authors}
                                                        onValueChange={(e) => field.onChange(e)}
                                                        defaultValue={field.value}
                                                        placeholder="Selecciona los autores"
                                                        //variant="inverted"
                                                        animation={2}
                                                        maxCount={2}
                                                    />
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* CATEGORIES */}
                                        <FormField
                                            control={formToCreateBook?.control}
                                            name="categorias"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm text-gray-900 font-bold'>Categorías</FormLabel>
                                                    <MyMultiSelect
                                                        {...field}
                                                        options={categories}
                                                        onValueChange={(e) => field.onChange(e)}
                                                        defaultValue={field.value}
                                                        placeholder="Selecciona las categorías"
                                                        variant="default"
                                                        animation={1}
                                                        maxCount={4}
                                                    />
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />

                                        {/* PUBLISH DATE */}
                                        <FormField
                                            control={formToCreateBook.control}
                                            name="fecha_publicacion"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='text-sm text-gray-900 font-bold'>Fecha de publicación</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-medium",
                                                                    !field?.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {field?.value ? format(field?.value, "PPP", { locale: es }) : <span>Selecciona la fecha</span>}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <CalendarWithMonthYear
                                                                mode="single"
                                                                selected={field?.value}
                                                                onSelect={field?.onChange}
                                                                autoFocus
                                                                startMonth={new Date(Number(currentYear - 100 + 1), 0)}
                                                                endMonth={new Date(currentYear, currentMonth, currentDay)}
                                                                disabled={[{ after: new Date(currentYear, currentMonth, currentDay) }]}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage className='text-red-700' />
                                                </FormItem>
                                            )}
                                        />

                                    </div>

                                    <div className='pt-8 grid grid-flow-col justify-stretch gap-4'>
                                        <SheetClose asChild>
                                            <Button type="button" className='bg-rose-500 hover:bg-red-500 font-bold text-gray-100 dark:text-gray-100' onClick={clearBookForm}>Cancelar</Button>
                                        </SheetClose>
                                        <Button type="submit" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                            {isUpdateActive ? 'Actualizar' : 'Crear Libro'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </SheetContent>
                    </Sheet>

                </div>
            </div >

            {
                allTheBooks && allTheBooks.length === 0 ? (<div
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
                    <MyTable myData={allTheBooks} myColumns={columns} rowsName={allTheBooks?.length === 1 ? 'Libro' : 'Libros'} />
                )
            }

            {/* CAN BE DELETED ALERTDIALOG */}
            <AlertDialog open={canBeDeletedDialog} onOpenChange={setCanBeDeletedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl text-red-700 text-center'>{selectedBookToDelete?.titulo}</AlertDialogTitle>
                        <AlertDialogDescription className='flex flex-col text-base text-gray-900 text-center'>
                            <span className='text-base font-bold'>Se eliminará esta categoría y todas estas Sub-Categorías:</span>

                            {/* <span>
                                <span className='text-sm text-red-600 font-bold'>{selectedCategoryToDelete?.sub_categories?.join(', ')}</span>
                            </span> */}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-blue-500 hover:bg-blue-600 text-gray-100 hover:text-gray-100 font-bold'>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className='bg-rose-500 hover:bg-red-600 font-bold' onClick={() => deleteBook(selectedBookToDelete?.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default BooksPage