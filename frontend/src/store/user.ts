import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Usuario } from '@/types/myTypes';

type UserState = {
    userSession: Usuario | null;
    setUserSession: (newUserSession: Usuario | null) => void;
}

const useFastLibraryStore = create<UserState>()(

    devtools(
        persist(
            (set) => ({
                userSession: null,
                setUserSession: (newUserSession: Usuario | null) => set(
                    { userSession: newUserSession }
                ),
            }),

            { name: "fast_library_zustand_store" }
        )
    )
)
export default useFastLibraryStore;