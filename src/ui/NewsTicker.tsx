import { useState, useEffect } from 'react'

interface NewsItem {
  id: number
  title: string
  url?: string
  score: number
  by: string
  time: number
}

export const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(false)

  const fetchTopStories = async () => {
    try {
      setError(null)

      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
      if (!response.ok) throw new Error('Failed to fetch top stories')

      const storyIds: number[] = await response.json()
      const topStoryIds = storyIds.slice(0, 8)

      const storyPromises = topStoryIds.map(async (id) => {
        try {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          if (!storyResponse.ok) return null
          const story = await storyResponse.json()
          return story
        } catch (err) {
          return null
        }
      })

      const stories = await Promise.all(storyPromises)
      const validStories = stories.filter(story =>
        story &&
        story.title &&
        (story.type === 'story' || !story.type) &&
        !story.deleted &&
        !story.dead
      )

      setLoading(false)
      setNews(validStories)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch news'
      setError(errorMsg)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopStories()
    const interval = setInterval(fetchTopStories, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Check if user is within 100px of the bottom
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      setIsAtBottom(distanceFromBottom <= 100)
    }

    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (error) {
    return (
      <div className={`news-ticker error ${isAtBottom ? 'at-bottom' : ''}`}>
        <div className="news-content">
          <span className="news-item">📡 News feed offline - {error}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`news-ticker loading ${isAtBottom ? 'at-bottom' : ''}`}>
        <div className="news-content">
          <span className="news-item">📡 Loading latest tech news...</span>
        </div>
      </div>
    )
  }

  if (!loading && news.length === 0 && !error) {
    return (
      <div className={`news-ticker ${isAtBottom ? 'at-bottom' : ''}`}>
        <div className="news-label">📡 TECH NEWS</div>
        <div className="news-content">
          <span className="news-item">No stories available at the moment</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`news-ticker ${isAtBottom ? 'at-bottom' : ''}`}>
      <div className="news-label">📡 TECH NEWS</div>
      <div className="news-content">
        {news.map((item, index) => (
          <span key={`${item.id}-${index}`} className="news-item">
            <strong>{item.title}</strong>
            {item.score && <span className="news-score"> [{item.score}↑]</span>}
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-link"
                title="Open story in new tab"
              >
                ↗
              </a>
            )}
            <span className="news-separator"> • </span>
          </span>
        ))}
      </div>
    </div>
  )
}