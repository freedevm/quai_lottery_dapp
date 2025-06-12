import Link from "next/link";

export default function Footer () {
    return (
        <div className="flex flex-col items-center bg-purple-800 text-center text-surface text-purple-300">
            <div className="container pt-9">
                <div className="mb-6 flex justify-center space-x-2">
                    {/* <Link
                        href="#!"
                        type="button"
                        className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-purple-300 hover:text-purple-800 focus:outline-none focus:ring-0"
                        data-twe-ripple-init>
                        <span className="[&>svg]:h-5 [&>svg]:w-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 320 512">
                            <path
                            d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                        </svg>
                        </span>
                    </Link> */}

                    <Link
                        href="https://x.com/quailottery"
                        target="_blank"
                        type="button"
                        className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-purple-300 hover:text-purple-800 focus:outline-none focus:ring-0"
                        data-twe-ripple-init>
                        <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 512 512">
                            <path
                            d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                        </svg>
                        </span>
                    </Link>

                    {/* <Link
                        href="#!"
                        type="button"
                        className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-purple-300 hover:text-purple-800 focus:outline-none focus:ring-0"
                        data-twe-ripple-init>
                        <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 488 512">
                            <path
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                        </svg>
                        </span>
                    </Link> */}

                    {/* <Link
                        href="https://www.instagram.com/ethereum_lottery/"
                        type="button"
                        target="_blank"
                        className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-purple-300 hover:text-purple-800 focus:outline-none focus:ring-0"
                        data-twe-ripple-init>
                        <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 448 512">
                            <path
                            d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                        </span>
                    </Link> */}

                    <Link
                        href="https://discord.gg/M6nUYVf3PY"
                        type="button"
                        target="_blank"
                        className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-purple-300 hover:text-purple-800 focus:outline-none focus:ring-0"
                        data-twe-ripple-init>
                        <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 16 16"><path fill="currentColor" d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011a.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0a8 8 0 0 0-.412-.833a.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02a.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595a.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085a8 8 0 0 1-1.249.594a.05.05 0 0 0-.03.03a.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019a13.2 13.2 0 0 0 4.001-2.02a.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613c0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613c0 .888-.631 1.612-1.438 1.612"/></svg>
                        </span>
                    </Link>

                    {/* <Link
                        href="https://t.me/ethereumlotteryorg"
                        type="button"
                        target="_blank"
                        className="rounded-full bg-transparent p-3 font-medium uppercase leading-normal text-surface transition duration-150 ease-in-out hover:bg-purple-300 hover:text-purple-800 focus:outline-none focus:ring-0"
                        data-twe-ripple-init>
                        <span className="mx-auto [&>svg]:h-5 [&>svg]:w-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.5 16L9 19.5L7 13l-5.5-2l21-8l-4 18l-7.5-7l4-3"/></svg>
                        </span>
                    </Link> */}
                </div>
            </div>

            <div className="w-full bg-black/5 p-4 text-center">
                © {new Date().getFullYear()} Copyright&nbsp;|&nbsp;
                <Link href="https://quai-lottery.vercel.app/">Quai Lottery</Link>
            </div>
        </div>
    )
}