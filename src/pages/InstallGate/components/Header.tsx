export default function Header() {
    return (
        <div className="w-full flex flex-col items-center text-center">
            <img src="/agos.svg" className="w-20 mb-8" />

            <p className="font-bold text-3xl">Install AGOS to Continue</p>
            <p className="font-medium mt-2 text-gray-700 dark:text-gray-300">
                AGOS must be installed on your home screen to receive push
                notifications.
            </p>
        </div>
    );
}
