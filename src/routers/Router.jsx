import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// NOTE: Place all routers here

import ServiceFinder from '../pages/ServiceFinder'
import ServiceProviderSignUp from '../pages/ServiceProvideSignUp'
import ServiceDetail from '../pages/ServiceDetail'
import ParticlesBg from '../components/ParticlesBg'
import Addservice from '../pages/Addservice'

import ServiceProviderIndex from '../pages/ServiceProviderIndex'

import RequestDetail from '../pages/RequestDetail'
import ManageAccount from '../pages/ManageAccount'
import ManageRequest from '../pages/ManageRequest'
import ManageService from '../pages/ManageService'
import EditService from '../pages/EditService'
import Admin from '../pages/Admin'
import ServiceProviderBusinessData from '../pages/ServiceProviderBusinessData'

import LoginPage from '../pages/LoginPage'
// import MapTest from '../TEST/MapTest'
import CustomerSignUp from '../pages/CustomerSignUp'
import CustomerPage from '../pages/CustomerPage'
// import GenTestData from '../TEST/GenTestData'

const router = createBrowserRouter([
  // 开发用
  {
    path: '/',
    element: <ServiceFinder />,
  },

  {
    path: '/service-find',
    element: <ServiceFinder />,
  },
  {
    // HINT: userParams() to get srv_id
    path: '/service/:srv_id',
    element: <ServiceDetail />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    children: [{}],
  },

  {
    path: '/service-provider',
    element: <ServiceProviderIndex />,
    children: [
      {
        path: '',
        element: <ServiceProviderBusinessData />,
      },
      {
        path: 'manage-service',
        element: <ManageService />,
      },
      {
        path: 'manage-account',
        element: <ManageAccount />,
      },
      {
        path: 'manage-request',
        element: <ManageRequest />,
      },
      {
        path: 'add-service',
        element: <Addservice />,
      },
      {
        path: 'request-detail/:id',
        element: <RequestDetail />,
      },
      {
        path: 'edit-service/:id',
        element: <EditService />,
      },
      {
        path: 'business-data',
        element: <ServiceProviderBusinessData />,
      },
    ],
  },
  { path: '/pa', element: <ParticlesBg /> },
  { path: '/customer-signup', element: <CustomerSignUp /> },
  { path: '/request-detail', element: <RequestDetail /> },
  { path: '/provider-signup', element: <ServiceProviderSignUp /> },
  { path: '/admin', element: <Admin /> },
  {
    path: '/mypage/:user_id/:activeTab',
    element: <CustomerPage />,
  },
  // TEST: below are test comps
  // {
  //   path: '/map',
  //   element: <MapTest />,
  // },
  // {
  //   path: '/gentest',
  //   element: <GenTestData />,
  // },
])

export default function Router() {
  return <RouterProvider router={router} />
}
