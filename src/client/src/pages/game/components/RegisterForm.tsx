import {useState} from "react";
import {PLAYER_NAME_PATTERN_REGEXP, ROOM_ID_PATTERN_REGEXP} from "@shared/utils/regex.utils.ts";
import FormButton from "@client/src/pages/game/components/FormButton.tsx";
import PlayerNameFormField from "@client/src/pages/game/components/PlayerNameFormField.tsx";
import RoomIDFormField from "@client/src/pages/game/components/RoomIDFormField.tsx";
import FormErrorsDisplay from "@client/src/pages/game/components/FormErrorsDisplay.tsx";

export type FormError = {
    key: string;
    message: string;
}

export type FormErrors = Array<FormError>

type RegisterFormProps = {
    onSubmit: (playerName: string, roomID: string) => Promise<void>;
};

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
    const [playerName, setPlayerName] = useState<string>('');
    const [roomID, setRoomID] = useState<string>('');

    const [errors, setErrors] = useState<FormErrors>([]);

    function validateForm(): boolean {
        let newErrors: typeof errors = [];

        if (!!playerName.trim() && !PLAYER_NAME_PATTERN_REGEXP.test(playerName)) {
            newErrors.push({
                key: playerName,
                message: 'must only contain letters and numbers, up to 50 characters'
            });
        }

        if (!!roomID.trim() && !ROOM_ID_PATTERN_REGEXP.test(roomID)) {
            newErrors.push({
                key: roomID,
                message: 'must be between 1 and 9999'
            });
        }

        setErrors(newErrors);

        return newErrors.length === 0;
    }

    async function submit(): Promise<void> {
        if (!validateForm()) {
            return;
        }

        await onSubmit(playerName, roomID);
    }

    return (
        <div className="mx-auto flex w-full flex-1 max-w-xl items-center px-6">
            <form className="flex flex-col gap-2 w-full" action={submit}>
                <div>
                    <p className="mb-3 font-mono text-sm tracking-[0.3em] text-(--text-muted)">
                        READY.&nbsp;SET.&nbsp;PLAY.
                    </p>

                    <h1 className="mb-2 text-4xl font-bold">
                        <span className="text-(--accent)">JOIN</span>&nbsp;ROOM
                    </h1>
                </div>

                <PlayerNameFormField setPlayerName={setPlayerName} validateForm={validateForm}/>
                <RoomIDFormField setRoomID={setRoomID} validateForm={validateForm}/>
                <FormErrorsDisplay errors={errors}/>
                <FormButton/>
            </form>
        </div>
    )
}