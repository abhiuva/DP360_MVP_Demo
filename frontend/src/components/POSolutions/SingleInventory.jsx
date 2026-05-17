import React from 'react'

export default function SingleInventory({pos}) {
    const { title, image, paragraph, author, tags, publishDate } = pos;
  return (
    <>
      <div className="group relative overflow-hidden rounded-lg bg-white shadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
        
          <img src={image} alt="image" fill className='rounded-lg' />
      
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h3 className='font-bold mb-8'>
              {title}
          </h3>
          <p className="mb-6  pb-6 text-md">
            {paragraph}
          </p>
          
        </div>
      </div>
    </>
  )
}
