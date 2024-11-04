import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  NavLink,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";

import "./index.css";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";

const PageIndex = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Workout Timers</h1>
      <ul style={navListStyle}>
        <li>
          <NavLink to="/" style={linkStyle} >Timers</NavLink>
        </li>
        <li>
          <NavLink to="/docs" style={linkStyle}> Documentation</NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

const navListStyle = {
  display: 'flex',
  listStyle: 'none',
  justifyContent: 'center',
  padding: 0,
  gap: '1rem',
  marginTop: '1rem',
};

const linkStyle = {
  textDecoration: 'underline',
  color: 'black',
  fontSize: '1.1rem',
};


// const TimersPages = () => {
//   return (
//     <ul>
//         <li>
//           <Link to="/">Countdown</Link>
//         </li>
//         <li>
//           <Link to="/docs">Stopwatch</Link>
//         </li>
//       </ul>
//   )
// }

const router = createHashRouter([
  {
    path: "/",
    element: <PageIndex />,
    children: [
      {
        index: true,
        element: <TimersView />,
      },
      {
        path: "/docs",
        element: <DocumentationView />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
