type TetrisBoardProps = {
    size: keyof typeof BOARD_SIZES;
    name: string;
}

const BOARD_SIZES = {
    normal: 'w-60 h-120',
    small: 'w-40 h-80'
};

export default function TetrisBoard({ size = 'normal', name }: TetrisBoardProps) {
    return (
        <div className={`relative
            flex justify-center items-center
            border rounded-md border-(--accent)/40
            bg-black/30
            shadow-(--shadow-red-soft)
            ${BOARD_SIZES[size]}`}
        >
            <h3 className='absolute top-2 left-0 w-full text-center opacity-50'>{name}</h3>
            <span className="font-mono text-(--text-muted)">Tetris&nbsp;preview</span>
        </div>
    )
}