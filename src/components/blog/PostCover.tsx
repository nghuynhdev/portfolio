import Image from 'next/image'
import type { PostMeta } from '@/lib/blog'

type Props = {
  post: Pick<PostMeta, 'title' | 'cover' | 'order' | 'tags'>
  /** `sizes` hint for next/image; match the rendered width. */
  sizes: string
  priority?: boolean
  className?: string
  /** Smaller type for thumbnails. */
  compact?: boolean
}

/**
 * 16:9 cover for a post. Posts without an image get a branded placeholder
 * (series number + topic) so grids stay visually consistent.
 */
export default function PostCover({ post, sizes, priority, className = '', compact }: Props) {
  const frame = `relative aspect-video overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0e18] ${className}`

  if (post.cover) {
    return (
      <div className={frame}>
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    )
  }

  const topic = post.tags.find((t) => t !== 'AI' && t !== 'Developer') ?? 'AI for Devs'
  return (
    <div className={frame} aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--accent) / 0.12) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--accent) / 0.12) 1px, transparent 1px)',
          backgroundSize: compact ? '14px 14px' : '28px 28px',
        }}
      />
      <div className="absolute -right-8 -bottom-10 w-2/3 h-2/3 rounded-full bg-accent/20 blur-[60px]" />
      <div className="absolute -left-10 -top-10 w-1/2 h-1/2 rounded-full bg-amber-400/10 blur-[60px]" />
      <div className={`relative h-full flex flex-col justify-between ${compact ? 'p-2.5' : 'p-5'}`}>
        <span
          className={`font-semibold uppercase tracking-[0.18em] text-accent/90 ${compact ? 'text-[8px]' : 'text-[11px]'}`}
        >
          AI for Devs
        </span>
        <div>
          <div
            className={`font-bold leading-none text-white/90 tabular-nums ${compact ? 'text-2xl' : 'text-5xl sm:text-6xl'}`}
          >
            {String(post.order).padStart(2, '0')}
          </div>
          <div className={`mt-1 text-gray-400 ${compact ? 'text-[9px]' : 'text-sm'}`}>{topic}</div>
        </div>
      </div>
    </div>
  )
}
