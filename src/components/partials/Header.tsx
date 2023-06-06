import Image from 'next/image'
import React from 'react'

export const Header = () => {
  return (
    <header>
      <Image
        src="https://links.papareact.com/c2cdd5"
        alt='Trello logo'
        width={300}
        height={100}
        className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
      />
    </header>
  )
}
