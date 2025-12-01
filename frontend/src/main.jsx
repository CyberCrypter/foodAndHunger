import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/main/HomePage';
import DDashboard from './pages/donor/DDashboard';
import CustomError from './pages/Error/CustomError';
import RecipientDetail from './pages/recipient/RecipientDetail';
import DonorDetail from './pages/donor/DonorDetail';
import RDashboard from './pages/recipient/RDashboard';
import Login from './pages/Auth/LoginPopUp';
import Register from './pages/Auth/Register';
import About from './pages/main/About';
import JoinUs from './pages/Auth/JoinUs';
import VDashboard from './pages/volunteer/VDashboard';
import VolunteerDetail from './pages/volunteer/VolunteerDetail';
import Volunteer from './Components/volunteer/Volunteer';
import AdminLayout from './Components/admin/AdminLayout';
import AdminDashboard from './Components/admin/AdminDashboard';
import ManageRequests from './Components/admin/ManageRequests';
import ManageDonations from './Components/admin/ManageDonations';
import ManageDonors from './Components/admin/ManageDonors.jsx';
import ManageRecipients from './Components/admin/ManageRecipients.jsx';
import ManageUsers from './Components/admin/ManageUsers.jsx';
import ManageVolunteers from './Components/admin/ManageVolunteers';
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        ErrorElement: <CustomError />, // create custom error component and change it
        children: [
            {
                index: true,
                element: <Home /> // check if user logged in if yes, pass the param
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "volunteer",
                element: <Volunteer />
            }
        ]
    },
    {
        path: "/donors",
        element: <App />,
        ErrorElement: <CustomError />,
        // ErrorElement: <Error />, // create custom error component and change it
        children: [
            {
                path: "dashboard",
                element: <DDashboard />
            },
            {
                path: "details/:donor_id",
                element: <DonorDetail />
            },
        ]
    },
    {
        path: "/recipients",
        element: <App />,
        ErrorElement: <CustomError />, // create custom error component and change it
        children: [
            {
                path: "dashboard",
                element: <RDashboard />
            },
            {
                path: "details/:recipient_id",
                element: <RecipientDetail />
            },
        ]
    },
    {
        path: "/volunteers",
        element: <App />,
        ErrorElement: <CustomError />, // create custom error component and change it
        children: [
            {
                path: "dashboard",
                element: <VDashboard />
            },
            {
                path: "details/:volunteer_id",
                element: <VolunteerDetail />
            },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "dashboard",
                element: <AdminDashboard />
            },
            {
                path: "requests",
                element: <ManageRequests />
            },
            {
                path: "donations",
                element: <ManageDonations />
            },
            {
                path: "users",
                element: <ManageUsers />
            },
            {
                path: "donors",
                element: <ManageDonors />
            },
            {
                path: "recipients",
                element: <ManageRecipients />
            },
            {
                path: "volunteers",
                element: <ManageVolunteers />
            }
        ]
    },
    {
        path: "/auth",
        element: <App />,
        ErrorElement: <CustomError />, // create custom error component and change it
        children: [
            {
                path: "login",
                element: <Login />
            },
            {
                path: "recipient/register",
                element: <Register />
            },
            {
                path: "donor/register",
                element: <Register />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "join_us",
                element: <JoinUs />
            },
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* <App /> */}
        <RouterProvider router={router} />
    </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
