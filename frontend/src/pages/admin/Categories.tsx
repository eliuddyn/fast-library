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
import { Categoria } from '@/types/myTypes';


const categoryFormSchema = z.object({
    name: z.string({ required_error: "Requerido" }).min(2, { message: "Mínimo 2 caracteres" })
})

const categories = [
    { id: '1', nombre: 'FICCIÓN' },
    { id: '2', nombre: 'AVENTURA' },
    { id: '3', nombre: 'ROMANCE' },
    { id: '4', nombre: 'SUSPENSO' },
]

const CategoriesPage = () => {

    const [allTheCategories, setAllTheCategories] = useState<Categoria[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<Categoria | null>(null);
    const [isUpdateActive, setIsUpdateActive] = useState<boolean | undefined>(false);
    const [isSheetOpened, setIsSheetOpened] = useState<boolean>(false);
    const [canBeDeletedDialog, setCanBeDeletedDialog] = useState<boolean>(false);
    const [canNotBeDeletedDialog, setCanNotBeDeletedDialog] = useState<boolean>(false);

    const formToCreateCategory = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        mode: "onSubmit",
        defaultValues: {
            name: '',
        },
    });

    const columns: ColumnDef<Categoria[] | any>[] = [
        {
            accessorKey: "thePosition",
            header: "#",
            cell: ({ row }) => (
                <span className='font-medium'>{row.index + 1}</span>
            ),
        },
        {
            accessorKey: "nombre",
            header: "Categoría",
            cell: ({ row }) => (
                <span className='text-gray-700 font-bold'>{row?.original?.nombre}</span>
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
                                    onClick={() => fillCategoryToUpdate(row?.original)}
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
                                    onClick={() => fillCategoryToDelete(row?.original)}
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
        getAllCategories();
    }, [])

    const getAllCategories = async () => {

        categories.sort(function (a: any, b: any) {
            if (a?.nombre < b?.nombre) {
                return -1;
            }
            if (a?.nombre > b?.nombre) {
                return 1;
            }
            return 0;
        });

        setAllTheCategories(categories)
    }

    async function createCategory(values: z.infer<typeof categoryFormSchema>) {

        const myCategory = {
            nombre: upperCaseFunction(values?.name),
        }

        console.log(myCategory)

        try {
            // await db.categories.create(myCategory)
            getAllCategories()
            clearCategoryForm()

        } catch (error) {
            console.log(error)
        }
    }

    const fillCategoryToUpdate = (theCategory: any) => {

        formToCreateCategory?.setValue('name', theCategory?.nombre);

        setSelectedCategory(theCategory)
        setIsUpdateActive(true)
        setIsSheetOpened(true)
    }

    async function updateCategory(values: z.infer<typeof categoryFormSchema>) {

        const myCategory = {
            nombre: upperCaseFunction(values?.name),
        }

        console.log(myCategory)

        try {
            // await db.categories.update(selectedCategory?.$id, myCategory);
            getAllCategories()
            clearCategoryForm()
        } catch (error) {
            console.log(error)
        }
    }

    const fillCategoryToDelete = (theCategory: any) => {

        // Check if this category has books attached 

        if (theCategory?.books?.length === 0) {
            setSelectedCategoryToDelete(theCategory)
            setCanBeDeletedDialog(true)
        } else {
            setSelectedCategoryToDelete(theCategory)
            setCanNotBeDeletedDialog(true)
        }
    }

    const deleteCategory = async (categoryID: string | undefined) => {

        console.log(categoryID)
        //await db.categories.delete(categoryID)
        getAllCategories()
        clearCategoryForm()
    }

    const clearCategoryForm = () => {
        setIsSheetOpened(false)
        formToCreateCategory?.reset();
        setIsUpdateActive(false)
        setSelectedCategory(null)
        setCanNotBeDeletedDialog(false)
        setCanBeDeletedDialog(false)
        setSelectedCategoryToDelete(null)
    }

    if (!allTheCategories) {
        return (
            <div className='flex space-x-2 justify-center items-center h-screen'>
                <span className='sr-only'>Loading...</span>
                <div className='h-8 w-8 bg-blue-800 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div className='h-8 w-8 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-8 w-8 bg-amber-400 rounded-full animate-bounce'></div>
            </div>
        );
    }

    return (
        <>
            <PageHeader pageName="Categorías" />

            <div className="pt-4 flex items-center justify-end">
                <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">

                    {/* CATEGORY FORM */}
                    <Sheet open={isSheetOpened} onOpenChange={setIsSheetOpened}>
                        <SheetTrigger asChild>
                            <Button variant="default" className='bg-slate-700 hover:bg-blue-700 font-bold'>
                                Agregar Categoría
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
                                        <span className='text-amber-400 text-xl'>{selectedCategory?.nombre}</span>
                                        :
                                        'Agregar Categoría'
                                    }
                                </SheetTitle>
                                <SheetDescription className='text-gray-200 text-base text-center'>
                                    {isUpdateActive ? 'Actualiza esta categoría' : ''}
                                </SheetDescription>
                            </SheetHeader>
                            <Form {...formToCreateCategory}>
                                <form className='p-4' onSubmit={formToCreateCategory?.handleSubmit(isUpdateActive ? updateCategory : createCategory)}>

                                    <div className="grid gap-6">

                                        {/* NAME */}
                                        <FormField
                                            control={formToCreateCategory?.control}
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
                                            <Button type="button" className='bg-rose-500 hover:bg-red-500 font-bold text-gray-100 dark:text-gray-100' onClick={clearCategoryForm}>Cancelar</Button>
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
            </div >

            {
                allTheCategories && allTheCategories.length === 0 ? (<div
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
                    <MyTable myData={allTheCategories} myColumns={columns} rowsName={allTheCategories?.length === 1 ? 'Categoría' : 'Categorías'} />
                )
            }

            {/* CANNOT BE DELETED ALERT DIALOG */}
            <AlertDialog open={canNotBeDeletedDialog} onOpenChange={setCanNotBeDeletedDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='text-2xl text-red-700 text-center'>{selectedCategoryToDelete?.nombre}</AlertDialogTitle>
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
                        <AlertDialogTitle className='text-2xl text-red-700 text-center'>{selectedCategoryToDelete?.nombre}</AlertDialogTitle>
                        <AlertDialogDescription className='flex flex-col text-base text-gray-900 text-center'>
                            <span className='text-base font-bold'>Se eliminará esta categoría y todas estas Sub-Categorías:</span>

                            {/* <span>
                                <span className='text-sm text-red-800 font-bold'>{selectedCategoryToDelete?.sub_categories?.join(', ')}</span>
                            </span> */}

                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='bg-blue-500 hover:bg-blue-600 text-gray-100 hover:text-gray-100 font-bold'>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className='bg-rose-500 hover:bg-red-600 font-bold' onClick={() => deleteCategory(selectedCategoryToDelete?.id)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export default CategoriesPage