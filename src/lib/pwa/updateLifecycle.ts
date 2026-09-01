const UPDATE_CHECK_INTERVAL_MS = 30_000;

interface RouteChangeSource {
    subscribe: (listener: () => void) => () => void;
}

/** Keep long-running SPA sessions aligned with the newest deployed worker. */
export function startPwaUpdateLifecycle(
    router: RouteChangeSource,
): () => void {
    if (!("serviceWorker" in navigator)) return () => undefined;

    let disposed = false;
    let registration: ServiceWorkerRegistration | null = null;
    let lastCheckAt = 0;
    let checkInFlight: Promise<void> | null = null;
    let isReloading = false;
    let hadController = Boolean(navigator.serviceWorker.controller);
    let observedWorker: ServiceWorker | null = null;
    let workerStateHandler: (() => void) | null = null;

    const activateWaitingWorker = () => {
        if (registration?.waiting && navigator.serviceWorker.controller) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
    };

    const observeInstallingWorker = () => {
        if (!registration?.installing) return;
        if (observedWorker && workerStateHandler) {
            observedWorker.removeEventListener(
                "statechange",
                workerStateHandler,
            );
        }
        observedWorker = registration.installing;
        workerStateHandler = () => {
            if (observedWorker?.state === "installed") {
                activateWaitingWorker();
            }
        };
        observedWorker.addEventListener("statechange", workerStateHandler);
    };

    const checkForUpdate = (force = false) => {
        if (disposed || !navigator.onLine) return Promise.resolve();
        if (
            !force &&
            Date.now() - lastCheckAt < UPDATE_CHECK_INTERVAL_MS
        ) {
            return Promise.resolve();
        }
        if (checkInFlight) return checkInFlight;

        checkInFlight = (async () => {
            try {
                registration ??= await navigator.serviceWorker.ready;
                if (disposed) return;
                lastCheckAt = Date.now();
                await registration.update();
                activateWaitingWorker();
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.warn("PWA update check failed", error);
                }
            } finally {
                checkInFlight = null;
            }
        })();
        return checkInFlight;
    };

    const handleControllerChange = () => {
        if (!hadController) {
            hadController = true;
            return;
        }
        if (isReloading) return;
        isReloading = true;
        window.location.reload();
    };
    const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") void checkForUpdate(true);
    };
    const handleOnline = () => void checkForUpdate(true);
    const handleUpdateFound = () => observeInstallingWorker();

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        handleControllerChange,
    );
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    const unsubscribeFromRouter = router.subscribe(() => {
        void checkForUpdate();
    });

    void navigator.serviceWorker.ready.then((readyRegistration) => {
        if (disposed) return;
        registration = readyRegistration;
        registration.addEventListener("updatefound", handleUpdateFound);
        observeInstallingWorker();
        activateWaitingWorker();
        void checkForUpdate(true);
    });

    return () => {
        disposed = true;
        unsubscribeFromRouter();
        navigator.serviceWorker.removeEventListener(
            "controllerchange",
            handleControllerChange,
        );
        document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
        );
        window.removeEventListener("online", handleOnline);
        registration?.removeEventListener("updatefound", handleUpdateFound);
        if (observedWorker && workerStateHandler) {
            observedWorker.removeEventListener(
                "statechange",
                workerStateHandler,
            );
        }
    };
}
