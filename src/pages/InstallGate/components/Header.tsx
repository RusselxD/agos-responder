export default function Header() {
  return (
    <div className="w-full flex flex-col items-center text-center">
      <img src="/patrol.svg" className="w-20 mb-8" alt="Patrol" />

      <p className="font-bold text-3xl text-primary dark:text-accent">Install Patrol to Continue</p>
      <p className="font-medium mt-2 text-gray-700 dark:text-gray-500">
        Patrol must be installed on your home screen to receive push
        notifications.
      </p>
    </div>
  );
}
