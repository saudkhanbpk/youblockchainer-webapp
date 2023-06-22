import React from 'react'

export default function ModalIntro({video}) {
  return (
    <>
      <video width="100%" height="315" controls style={{borderRadius:'5px'}} autoPlay>
            <source src={video?.video3} type="video/mp4"  />
          </video>
    </>
  )
}
