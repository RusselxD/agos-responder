export default function Logout() {
    const handleLogout = () => {
        localStorage.clear();
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-5 w-full rounded-xl bg-red-50 text-white font-semibold border-2 border-red-200"
        >
            Logout
        </button>
    );
}
