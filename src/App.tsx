import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
    return (
        <div className="max-w-md mx-auto">
            <RouterProvider router={router} />
        </div>
    );
}
