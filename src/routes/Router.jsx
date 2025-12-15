import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import PrivateRoute from "../privateRoute/PrivateRoute";
import DonateNow from "../pages/DonateNow";

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
                {
                    path: '/donate-now',
                    element: <DonateNow></DonateNow>
                },
                {
                    path: '/profile',
                    element: (
                        <PrivateRoute>
                            <Profile></Profile>
                        </PrivateRoute>
                    )
                },
            ]
        }
    ]
)

export default router;