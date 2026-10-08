import {useState} from "react";
import RegisterForm from "@client/src/pages/game/components/RegisterForm.tsx";
import GameComponent from "@client/src/pages/game/components/GameComponent.tsx";
import {buildRegisterRoute} from "@client/src/http/routes.ts";

export default function GamePage() {
    const [isConnected, setConnected] = useState<boolean>(false);

    async function submit(playerName: string, roomID: string): Promise<void> {
        const response = await fetch(buildRegisterRoute(playerName, roomID));

        if (!response.ok) {
            return;
        }

        setConnected(true);
    }

    return (
        <div>
            {isConnected ? <GameComponent/> : <RegisterForm onSubmit={submit}/>}
        </div>
    )
}