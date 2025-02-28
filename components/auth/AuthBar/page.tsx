export default function AuthBar() {
    return (
        <>
            <div className='flex flex-col bg-cover bg-gray-50 dark:bg-zinc-900 w-full h-screen select-none relative'>
                <div className="w-full scale-100 h-screen bg-cover bg-center opacity-70 dark:opacity-30 bg-[url('/fi.jpg')] absolute">
                    <div className='w-full h-full scale-100 flex flex-col justify-center items-center dark:backdrop-invert'></div>
                </div>
            </div>
        </>
    )
}
