import React from 'react'

const Header = () => {
  return (
    <section className='bg-white w-screen sm:w-[400px] h-screen absolute right-0'>
        <div className='px-10 py-7 relative'>
          <span className='absolute right-5 top-3 text-gray-400 text-xl font-serif'>x</span>
          <h1 className='text-black text-xl font-medium'>Buy the set</h1>
            <div className='flex flex-row pt-10 h-60 items-center justify-center'>
              <div className='w-2/4 bg-gray-200 h-full flex items-center'>
                <img src="zapatilla.png" alt="" className='w-full object-contain px-4 '/>
              </div>
              <div className='w-2/3 flex flex-col items-center justify-center h-full px-4'>
                <div>
                  <h3 className='text-black font-semibold text-2sm line-clamp-1'>Marathon Dip-dye adadas</h3>
                  <p className='text-gray-400 text-sm py-1'>Leather + Polyester</p>
                  <span className='text-black font-normal pb-2 block'>240 <span className='font-normal text-xs'>EUR</span></span>
                  <div className='w-full border-[2px] border-gray-200 flex items-center justify-center px-2 py-2'>
                    <p className='text-black font-medium text-sm lg:text-sm'>EU 39 | US 6 | UK 5</p> 
                  </div>
                </div>
              </div>
            </div>
        </div>
    </section>
  )
}

export default Header