import type {Dispatch, SetStateAction} from "react";

type RoomIDFormFieldProps = {
    setRoomID: Dispatch<SetStateAction<string>>;
    validateForm: () => boolean;
};

export default function RoomIDFormField({ setRoomID, validateForm }: RoomIDFormFieldProps) {
    return (
        <div>
            <label htmlFor="name" className="mb-2 block text-sm text-(--text)">
                Room&nbsp;ID
            </label>

            <input
                id="roomID"
                name="roomID"
                type="number"
                placeholder="1, 2, 3..."
                required
                className="w-full
                    border border-(--accent)/40
                    focus:border-(--accent) focus:shadow-(--shadow-red-soft)
                    bg-(--bg-secondary)
                    px-4 py-3
                    placeholder:text-(--text-muted)
                    outline-none
                    transition
                    [&::-webkit-inner-spin-button]:appearance-none
                "
                onChange={e => setRoomID(e.target.value)}
                onBlur={validateForm}
            />
        </div>
    )
}