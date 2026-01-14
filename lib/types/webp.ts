/**
 * Checks if buffer contains WebP image
 *
 * @param buffer - The buffer to check
 * @returns True if the buffer contains a WebP image, false otherwise
 */
export function isWebp(buffer: Buffer): boolean {
  const WEBP = [0x57, 0x45, 0x42, 0x50]
  for (let i = 0; i < WEBP.length; i++) {
    if (buffer[i + 8] !== WEBP[i]) {
      return false
    }
  }
  return true
}

/**
 * Checks if buffer contains animated WebP image
 *
 * @param buffer - The buffer to check
 * @returns True if the buffer contains an animated WebP, false otherwise
 */
export function isAnimated(buffer: Buffer): boolean {
  const ANIM = [0x41, 0x4E, 0x49, 0x4D]
  for (let i = 0; i < buffer.length; i++) {
    let match = true
    for (let j = 0; j < ANIM.length; j++) {
      if (i + j >= buffer.length || buffer[i + j] !== ANIM[j]) {
        match = false
        break
      }
    }
    if (match) {
      return true
    }
  }
  return false
}
