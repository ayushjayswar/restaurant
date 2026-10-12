import React, { useState, useEffect } from 'react'
import ContentBlocks from '../components/Contentblocks'

// Tunnel ka URL badle to .env me VITE_API_URL set karo.
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://lcd-dressing-jim-oven.trycloudflare.com"

// Is component me ab kuch fixed nahi hai.
// Admin > Home > Content Blocks me jo bhi add karoge, sirf wahi yahan dikhega.
const Hero = () => {
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content`)
        if (!response.ok) return

        const result = await response.json()
        setBlocks(result?.hero?.content_blocks || [])
      } catch (err) {
        console.error("Site content fetch error:", err)
      }
    }

    fetchContent()
  }, [])

  return <ContentBlocks blocks={blocks} />
}

export default Hero