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
import DonationFormModal from './Components/donor/DonorFoodListingForm';
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
      {
        path: "recipient/form",
        element: <DonationFormModal/>
      }
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
