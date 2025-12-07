import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <MainLayout></MainLayout>,
            errorElement: <ErrorPage></ErrorPage>,
            children: [
                {
                    index: true,
                    element: <Home></Home>
                },
                {
                    path: '/home',
                    element: <Home></Home>
                },
                {
                    path: '/log-in',
                    element: <LogIn></LogIn>
                },
                {
                    path: '/sign-up',
                    element: <SignUp></SignUp>
                },
            ]
        }
    ]
)

export default router;