import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx"
import ErrorPage from "./pages/ErrorPage.jsx";
import TenantPage from "./pages/TenantPage.jsx";
import LandlordPage from "./pages/LandlordPage.jsx";
import LoginPage  from "./pages/LoginPage.jsx";
import AboutPage from "./pages/AboutPage.jsx"
import PropertiesPage from "./pages/PropertiesPage.jsx"
import ApartmentsList from "./pages/ApartmentsPage.jsx";
import AllApartmentsPage from "./pages/AllApartmentsPage.jsx"
import ApplicationPage from "./pages/ApplicationPage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage/>,
      },
      {
        path:'register/',
        element: <RegisterPage/>
      },
      {
        path:'tenant/',
        element: <TenantPage/>
      },
      {
        path:'apartments/',
        element: <AllApartmentsPage/>
      },
      {
        path:'tenant/:apartmentId/application/',
        element: <ApplicationPage/>
      },
      {
        path:'manager/',
        element: <LandlordPage/>
      },
      {
        path:'manager/properties/',
        element: <PropertiesPage/>
      },
      {
        path:'manager/properties/:propertyId/apartments/',
        element: <ApartmentsList/>
      },
      {
        path:'login/',
        element: <LoginPage/>
      },
      {
        path:'about/',
        element: <AboutPage/>
      },
      {
        path:'/*/',
        element: <HomePage/>
      }

    ],
    errorElement: <ErrorPage/>
  },
]);

export default router;
