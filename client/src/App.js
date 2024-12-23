import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Add from "./components/Admin/addArea/Add.jsx";
import Edit from './components/Admin/updateArea/Edit.jsx';
import Area from './components/Admin/getArea/getAllArea.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginAdmin from './components/Admin/LoginRigister/LoginAdmin.jsx';
import RegisterAdmin from './components/Admin/LoginRigister/RegisterAdmin.jsx';
import LoginUser from './components/User/LoginRigister/LoginUser.jsx';
import RegisterUser from './components/User/LoginRigister/RegisterUser.jsx';
import AreaSearch from "./components/Admin/getArea/getSearchArea.jsx";
import ErrorPage from './components/ErrorPage.jsx'; // Custom error component
import View from './components/Admin/getArea/ViewArea.jsx'
import Home from "./components/User/Home.jsx";
import AreaDetails from "./components/User/AreaDetails.jsx";
import SearchAreas from './components/User/SearchAreas.jsx';
import LocationFormfrom from './components/User/LoginRigister/LocationForm.jsx';


function App() {
  const route = createBrowserRouter([
    {
      path: "/add",
      element: <Add />,
      errorElement: <ErrorPage />, // Error boundary for this route
    },
    {
      path: "/edit/:id",
      element: <Edit />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/view/:id",
      element: <View/>,
      errorElement: <ErrorPage/>
    },
    {
      path: "/loginAdmin/",
      element: <LoginAdmin />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/getAll",
      element: <Area />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/registerAdmin",
      element: <RegisterAdmin />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: <LoginUser />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/registerUser",
      element: <RegisterUser />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/locationForm/:userId",
      element: <LocationFormfrom />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/getSearchArea/:searchs", // Corrected route path
      element: <AreaSearch />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/search/:userId/:search", // Corrected route path
      element: <SearchAreas />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/userHome/:userId",
      element:<Home/>,
      errorElement: <ErrorPage/>
    },
    {
      path : "/area/:userId/:id",
      element : <AreaDetails />
    }
  ]);

  return (
    <div id="all">
      <RouterProvider router={route}></RouterProvider>
    </div>
  );
}

export default App;
