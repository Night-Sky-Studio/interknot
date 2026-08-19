import { type Transform } from "@interknot/types"
import { useEffect, useState } from "react"

/** Gap between the top of the image frame and the top of the image */
export const TOP_MARGIN = 10

export const MIN_SCALE = 0.1
export const MAX_SCALE = 5
export const ZOOM_STEP = 0.05

export interface Size {
    width: number
    height: number
}

export interface Placement {
    /** Rendered image size */
    width: number
    height: number
    /** Offset of the image's top-left corner from the frame's top-left */
    x: number
    y: number
    flipped: boolean
}

export function clamp(value: number, a: number, b: number): number {
    return Math.min(Math.max(value, Math.min(a, b)), Math.max(a, b))
}

/**
 * Layers `over` on top of `base`, ignoring keys that are unset
 */
export function mergeTransforms(base?: Transform, over?: Transform): Transform | undefined {
    if (!base) return over
    if (!over) return base

    return {
        X: over.X ?? base.X,
        Y: over.Y ?? base.Y,
        Scale: over.Scale ?? base.Scale,
        Flipped: over.Flipped ?? base.Flipped,
        Rotation: over.Rotation ?? base.Rotation
    }
}

/**
 * Resolves where the image should sit inside its frame
 */
export function computePlacement(frame: Size, image: Size, transform?: Transform): Placement {
    const { width: cw, height: ch } = frame
    const { width: iw, height: ih } = image

    const flipped = transform?.Flipped ?? false

    if (cw <= 0 || ch <= 0 || iw <= 0 || ih <= 0) {
        return { width: cw, height: ch, x: 0, y: 0, flipped }
    }

    const coverScale = Math.max(cw / iw, ch / ih)
    const scale = coverScale * clamp(transform?.Scale ?? 1, MIN_SCALE, MAX_SCALE)

    const width = iw * scale
    const height = ih * scale

    return {
        width,
        height,
        x: (cw - width) / 2 + (transform?.X ?? 0) * cw,
        y: TOP_MARGIN + (transform?.Y ?? 0) * ch,
        flipped
    }
}

export function placementTransform(placement: Placement): string {
    // scaleX is listed last so the translation stays in un-mirrored frame coordinates
    const translate = `translate3d(${placement.x.toFixed(2)}px, ${placement.y.toFixed(2)}px, 0)`
    return placement.flipped ? `${translate} scaleX(-1)` : translate
}


export interface ImageSize {
    width: number
    height: number
}

const cache = new Map<string, ImageSize>()
const pending = new Map<string, Promise<ImageSize>>()

function load(url: string): Promise<ImageSize> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
        img.src = url
    })
}

export function getImageSize(url: string): Promise<ImageSize> {
    const cached = cache.get(url)
    if (cached) return Promise.resolve(cached)

    let promise = pending.get(url)
    if (!promise) {
        // Object URLs are recreated on every read, so caching them only grows the map.
        const cacheable = !url.startsWith("blob:") && !url.startsWith("data:")

        promise = load(url).then(size => {
            pending.delete(url)
            if (cacheable) cache.set(url, size)
            return size
        }, (e: unknown) => {
            pending.delete(url)
            throw e
        })
        pending.set(url, promise)
    }
    return promise
}

interface ImageSizeState {
    value?: ImageSize
    loading: boolean
}

export function useImageSize(url?: string): ImageSizeState {
    const [state, setState] = useState<ImageSizeState>(() => {
        const cached = url ? cache.get(url) : undefined
        return cached ? { value: cached, loading: false } : { loading: url !== undefined }
    })

    useEffect(() => {
        if (!url) {
            setState({ loading: false })
            return
        }

        // Synchronous hit: skip the loading pass so cards do not flash a spinner on remount
        const cached = cache.get(url)
        if (cached) {
            setState({ value: cached, loading: false })
            return
        }

        let cancelled = false
        setState({ loading: true })

        getImageSize(url).then(value => {
            if (!cancelled) setState({ value, loading: false })
        }, (e: unknown) => {
            console.warn("Failed to load image", url, e)
            if (!cancelled) setState({ loading: false })
        })

        return () => {
            cancelled = true
        }
    }, [url])

    return state
}
