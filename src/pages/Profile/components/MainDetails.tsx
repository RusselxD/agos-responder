import { Pencil, Phone } from "lucide-react";
import { useState } from "react";
import Card from "../../../components/common/Card";
import { useCoreHook } from "../../../context/CoreContext";
import { useI18n } from "../../../context/I18nContext";
import { responderAPI } from "../../../lib/api/responder";
import { formatPHNumber } from "../../../lib/utils/phone";
import ConnectionStatus from "./ConnectionStatus";

const getLastChunkOfId = (id: string) => {
    let res = "";
    let i = id.length - 1;
    while (i >= 0 && id[i] !== "-") {
        res = id[i] + res;
        i--;
    }
    return res;
};

function NameEditor({ onClose }: { onClose: () => void }) {
    const { responder, setResponder } = useCoreHook();
    const { t } = useI18n();
    const [firstName, setFirstName] = useState(responder?.firstName ?? "");
    const [lastName, setLastName] = useState(responder?.lastName ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const hasChanges =
        trimmedFirst !== responder?.firstName ||
        trimmedLast !== responder?.lastName;
    const isValid = !!trimmedFirst && !!trimmedLast;

    const handleSave = async () => {
        if (!responder || !isValid || !hasChanges || isSaving) return;

        const payload: { firstName?: string; lastName?: string } = {};
        if (trimmedFirst !== responder.firstName)
            payload.firstName = trimmedFirst;
        if (trimmedLast !== responder.lastName) payload.lastName = trimmedLast;

        setIsSaving(true);
        setError(null);
        try {
            const updated = await responderAPI.updateResponderProfile(
                responder.id,
                payload,
            );
            setResponder(updated);
            onClose();
        } catch {
            setError(t("profile.updateFailed"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="space-y-2">
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t("profile.firstName")}
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => {
                            setError(null);
                            setFirstName(e.target.value);
                        }}
                        maxLength={100}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {t("profile.lastName")}
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => {
                            setError(null);
                            setLastName(e.target.value);
                        }}
                        maxLength={100}
                        className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}
            {!isValid && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    {t("profile.nameRequired")}
                </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 active:bg-gray-100 dark:active:bg-slate-700"
                >
                    {t("profile.cancel")}
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isValid || !hasChanges || isSaving}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                >
                    {isSaving ? t("profile.saving") : t("profile.save")}
                </button>
            </div>
        </div>
    );
}

export default function MainDetails() {
    const { responder } = useCoreHook();
    const { t } = useI18n();
    const [isEditing, setIsEditing] = useState(false);

    if (!responder) {
        return <div className="skeleton h-28 w-full rounded-xl" />;
    }

    return (
        <Card>
            <div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t("profile.responderProfile")}
                    </p>
                    <ConnectionStatus />
                </div>

                {isEditing ? (
                    <div className="mt-3">
                        <NameEditor onClose={() => setIsEditing(false)} />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-end mt-2">
                            <div className="space-y-1">
                                <h2 className="font-bold text-2xl dark:text-white">
                                    {`${responder.firstName || ""} ${responder.lastName || ""}`.trim() ||
                                        "Unknown"}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 dark:text-gray-300" />
                                    <p className="text-sm dark:text-gray-300">
                                        {responder.phoneNumber
                                            ? formatPHNumber(
                                                  responder.phoneNumber,
                                              )
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <p className="text-xs font-medium bg-accent/10 rounded-full px-2 py-1 w-fit text-accent">
                                    <span>ID: </span>
                                    <span>
                                        {responder.id
                                            ? getLastChunkOfId(responder.id)
                                            : "N/A"}
                                    </span>
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    aria-label={t("profile.editName")}
                                    className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-slate-600 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-slate-700"
                                >
                                    <Pencil className="w-3 h-3" />
                                    <span>{t("profile.editName")}</span>
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-[0.7rem] text-gray-400 dark:text-gray-500 italic">
                            {t("profile.phoneAdminOnly")}
                        </p>
                    </>
                )}
            </div>
        </Card>
    );
}
