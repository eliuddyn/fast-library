import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import Loading from "./components/Loading";

// PUBLIC ROUTES
const LoginPage = lazy(() => import("./pages/auth/Login"))

// ADMIN ROUTES
const AuthenticatedLayout = lazy(() => import("./components/AuthenticatedLayout"))
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboard"))
const CategoriesPage = lazy(() => import("./pages/admin/Categories"))
const LibrariansPage = lazy(() => import("./pages/admin/Librarians"))

// LIBRARIAN ROUTES
const AuthorsPage = lazy(() => import("./pages/librarian/Authors"))
const BooksPage = lazy(() => import("./pages/librarian/Books"))

// ERROR ROUTE
const ErrorPage = lazy(() => import("./ErrorPage"))

function App() {

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>

          <Route element={<PublicRoute />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>

              {/* ADMIN ROUTES */}
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/categorias" element={<CategoriesPage />} />
              <Route path="/bibliotecarios" element={<LibrariansPage />} />

              {/* LIBRARIAN ROUTES */}
              <Route path="/autores" element={<AuthorsPage />} />
              <Route path="/libros" element={<BooksPage />} />

            </Route>
          </Route>

          {/* ERROR ROUTE */}
          <Route path="/*" element={<ErrorPage />} />

        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
