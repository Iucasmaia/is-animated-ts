/**
 * Checks if buffer contains animated image
 *
 * @param buffer - The image buffer to check
 * @returns True if the image is animated, false otherwise
 */
function isAnimated(buffer: Buffer): boolean {
  const gif = require('./types/gif')
  const png = require('./types/png')
  const webp = require('./types/webp')

  if (gif.isGIF(buffer)) {
    return gif.isAnimated(buffer)
  }

  if (png.isPNG(buffer)) {
    return png.isAnimated(buffer)
  }

  if (webp.isWebp(buffer)) {
    return webp.isAnimated(buffer)
  }

  return false
}

export = isAnimated
