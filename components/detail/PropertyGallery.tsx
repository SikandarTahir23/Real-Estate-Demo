'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { PropertyImage } from '@/types'
import { cn } from '@/lib/utils'

interface PropertyGalleryProps {
  title: string
  // Ordered gallery for this property — real, locally-hosted photographs served
  // through next/image. The first image is shown on load.
  images: PropertyImage[]
}

// Interactive photo gallery for the detail page (§9): a large main stage plus a row
// of thumbnails. Selecting a thumbnail swaps the stage. The main image is prioritised
// (it is the largest above-the-fold visual); thumbnails lazy-load.
export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const t = useTranslations('detail.gallery')
  const [active, setActive] = useState(0)

  const activeImage = images[active]
  const roomLabel = (room: PropertyImage['room']) => t(`views.${room}`)

  return (
    <section aria-label={t('label')} className="space-y-3">
      {/* Main stage — accessible name states the property and the room shown. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone ring-1 ring-stone-dark">
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={t('viewAlt', { title, room: roomLabel(activeImage.room) })}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-3 left-3 rounded-md bg-ink/70 px-2.5 py-1 font-data text-xs text-stone">
          {roomLabel(activeImage.room)}
        </span>
      </div>

      {/* Thumbnail selector — real buttons so keyboard/focus works for free (§13). */}
      <ul className="grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              aria-label={roomLabel(image.room)}
              aria-current={index === active}
              onClick={() => setActive(index)}
              className={cn(
                'relative block aspect-square w-full overflow-hidden rounded-md bg-stone ring-1 transition-transform duration-150 hover:scale-[1.03] motion-reduce:transition-none',
                index === active ? 'ring-2 ring-brass-dark' : 'ring-stone-dark',
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 110px, 16vw"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
