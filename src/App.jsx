import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import { PrivateRoute, RootLayout } from "./layouts/RootLayout";
import Login from "./components/Login";
import Home from "./components/Home";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <PrivateRoute redirectTo="/login">
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Route>
    )
  );

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
