import {WsChannels} from "@shared/ws/wsChannels.ts";
import {useEffect, useState} from "react";
import type {RTSocket} from "@client/src/types/socket.ts";
import {CODE_TO_CHANNEL} from "@shared/socketEvents.ts";
import TetrisBoard from "@client/src/pages/game/components/TetrisBoard.tsx";

type GameComponentProps = {
    socket: RTSocket,
    roomID: string,
}

export default function GameComponent({ socket }: GameComponentProps) {
    const [opponents, setOpponents] = useState<number[]>([]);

    const boardSize = opponents.length <= 2 ? 'normal' : 'small';

    // When there is only one opponent, centers its board
    // When there are 2 opponents, uses a 2 columns grid
    // Otherwise, uses a 3 columns grid
    const gridClass = opponents.length === 1
        ? 'grid-cols-1 justify-items-center'
        : opponents.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-3';

    function handleStateChange() {
        console.log('handleStateChange');
    }

    function addOpponent() {
        setOpponents([...opponents, opponents.length]);
    }

    function removeOpponent() {
        setOpponents(prev => prev.slice(0, -1));
    }

    useEffect(() => {
        socket.on(WsChannels.STATE_CHANGED, handleStateChange);

        return () => {
            socket.off(WsChannels.STATE_CHANGED, handleStateChange);
        }
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const channel = CODE_TO_CHANNEL[event.code as keyof typeof CODE_TO_CHANNEL];

            // If the pressed key is not used in the game, we do not do anything and let the event propagate so that
            // the browser can keep its default behaviour.
            if (!channel || !socket.connected || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            // Prevent browser scrolling on arrow key press
            event.preventDefault();

            if (event.code === 'ArrowLeft') {
                socket.emit(WsChannels.MOVE_LEFT);
            } else if (event.code === 'ArrowUp') {
                socket.emit(WsChannels.ROTATE);
            } else if (event.code === 'ArrowRight') {
                socket.emit(WsChannels.MOVE_RIGHT);
            } else if (event.code === 'ArrowDown') {
                socket.emit(WsChannels.DROP_SOFT);
            } else if (event.code === 'Space') {
                socket.emit(WsChannels.DROP_HARD);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [socket]);

    return (
        // <TetrisBoard/>
        // <main className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6">
        //     <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-3">
        //
        //         {/* 1/3 Width: Main Player Board (Centred horizontally & vertically) */}
        //         <section className="flex items-center justify-center lg:col-span-1">
        //             <TetrisBoard />
        //         </section>
        //
        //          {/*2/3 Width: Opponents Dynamic Grid */}
        //         <section className="flex items-center justify-center lg:col-span-2">
        //             {opponents.length === 0 ? (
        //                 <div className="flex h-90 w-full max-w-md items-center justify-center rounded-md border border-(--accent)/20 bg-black/20 font-mono text-(--text-muted)">
        //                     Waiting for opponents to join...
        //                 </div>
        //             ) : (
        //                 <div className={`grid w-full gap-4 ${getGridColsClass(opponents.length)} justify-items-center`}>
        //                     {opponents.map((opponent) => (
        //                         <TetrisBoard key={opponent.id} />
        //                     ))}
        //                 </div>
        //             )}
        //         </section>
        //
        //     </div>
        // </main>
        <main className='flex w-full'>
            <div className='flex flex-col flex-2 justify-center items-center  '>
                <TetrisBoard size='normal' name='You'/>
                <div>
                    <button onClick={addOpponent}
                            className=" mt-10 cursor-pointer rounded-md bg-(--accent) px-10 py-4 text-lg font-bold
                            text-white transition hover:bg-(--accent-hover) hover:shadow-(--shadow-red)">
                        Add opponent
                    </button>
                    <button onClick={removeOpponent}
                            className=" mt-10 cursor-pointer rounded-md bg-(--accent) px-10 py-4 text-lg font-bold
                            text-white transition hover:bg-(--accent-hover) hover:shadow-(--shadow-red)">
                        Remove opponent
                    </button>
                </div>
            </div>

            <div className={`flex-3 grid gap-2 ${gridClass} content-center mt-1`}>
                <h2 className='col-span-3 text-center align-text-bottom'>
                    <span
                        className="text-(--accent)">{opponents.length === 0 ? 'No' : opponents.length}</span>&nbsp;opponent{opponents.length > 1 ? 's' : ''}
                </h2>
                {opponents.slice(0, 6).map((opponent) => (
                    <div key={opponent}>
                        <TetrisBoard size={boardSize} name={`Opponent ${opponents.indexOf(opponent) + 1}`}/>
                    </div>
                ))}
            </div>
        </main>
    )
}