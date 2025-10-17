import Image from 'next/image'

interface LogoProps {
    isLoggedIn?: boolean
}

export default function Logo({ isLoggedIn = false }: LogoProps) {
    const handleClick = () => {
        //redirect to dashboard
        const destination = isLoggedIn ? '/dashboard' : '/'
        window.location.href = destination
    }

    return (
        <div className='flex-shrirk-0 cursor-pointer' onClick={handleClick}>
            <Image src='/next.svg' alt='Logo' width={100} height={40} className='dark:invert'></Image>
        </div>
    )
}