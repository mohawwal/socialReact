import React from 'react'
import './skeleton.scss'

const Skeleton = ({maxWidth, minWidth, height, borderRadius, variant}) => {
    const style = {
        maxWidth, minWidth, height, borderRadius    }
  return (
    <span className={`skeleton ${variant}`} style={style}>
    </span>
  )
}

export default Skeleton
