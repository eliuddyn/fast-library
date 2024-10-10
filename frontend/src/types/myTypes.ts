/* eslint-disable @typescript-eslint/no-explicit-any */
export type Json =
    | string
    | number
    | boolean
    | null
    | any
    | { [key: string]: Json | undefined }
    | Json[]

export type Admin = {
    id: string
    nombre: string
    email: string
    role: string
}

export type Usuario = {
    id: string
    nombres: string
    apellidos: string
    email: string
    role: string
}

export type Autor = {
    id: string
    nombre: string
}

export type Categoria = {
    id: string
    nombre: string
}

export type Libro = {
    id: string
    titulo: string
    descripcion: string
    fecha_publicacion: string
}