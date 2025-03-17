"use client"

import type React from "react"
import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onRatingChange: (newRating: number) => void
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const handleStarClick = (selectedRating: number) => {
    // If clicking the same star that's already selected, toggle between whole and half star
    if (Math.ceil(rating) === selectedRating && rating % 1 !== 0) {
      onRatingChange(Math.floor(rating))
    } else if (Math.ceil(rating) === selectedRating && rating % 1 === 0) {
      onRatingChange(selectedRating - 0.5)
    } else {
      onRatingChange(selectedRating)
    }
  }

  const handleStarHover = (hoveredRating: number, isHalf = false) => {
    setHoverRating(isHalf ? hoveredRating - 0.5 : hoveredRating)
  }

  const handleStarLeave = () => {
    setHoverRating(null)
  }

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const displayRating = hoverRating !== null ? hoverRating : rating
        const isFullStar = displayRating >= star
        const isHalfStar = !isFullStar && displayRating >= star - 0.5

        return (
          <div key={star} className="relative cursor-pointer" onMouseLeave={handleStarLeave}>
            {/* Half star area (left half) */}
            <div
              className="absolute inset-0 w-1/2 z-10"
              onClick={() => handleStarClick(star - 0.5)}
              onMouseEnter={() => handleStarHover(star, true)}
            />

            {/* Full star area (right half) */}
            <div
              className="absolute inset-0 left-1/2 w-1/2 z-10"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
            />

            {/* Star icon */}
            <div className="relative">
              {/* Base star (outline) */}
              <Star className={`h-5 w-5 ${isFullStar || isHalfStar ? "text-yellow-500" : "text-gray-300"}`} />

              {/* Filled portion */}
              {isFullStar && <Star className="h-5 w-5 absolute top-0 left-0 text-yellow-500 fill-yellow-500" />}

              {/* Half filled portion */}
              {isHalfStar && (
                <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StarRating

