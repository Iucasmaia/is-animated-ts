/**
 * Checks if buffer contains PNG image
 *
 * @param buffer - The buffer to check
 * @returns True if the buffer contains a PNG image, false otherwise
 */
export function isPNG(buffer: Buffer): boolean {
  const header = buffer.slice(0, 8).toString('hex')
  return header === '89504e470d0a1a0a' // \211 P N G \r \n \032 \n
}

/**
 * Checks if buffer contains animated PNG image
 *
 * @param buffer - The buffer to check
 * @returns True if the buffer contains an animated PNG, false otherwise
 */
export function isAnimated(buffer: Buffer): boolean {
  let hasACTL = false
  let hasIDAT = false
  let hasFDAT = false

  let previousChunkType: string | null = null

  let offset = 8

  while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32BE(offset)
    const chunkType = buffer.slice(offset + 4, offset + 8).toString('ascii')

    switch (chunkType) {
      case 'acTL':
        hasACTL = true
        break
      case 'IDAT':
        if (!hasACTL) {
          return false
        }

        if (previousChunkType !== 'fcTL' && previousChunkType !== 'IDAT') {
          return false
        }

        hasIDAT = true
        break
      case 'fdAT':
        if (!hasIDAT) {
          return false
        }

        if (previousChunkType !== 'fcTL' && previousChunkType !== 'fdAT') {
          return false
        }

        hasFDAT = true
        break
    }

    previousChunkType = chunkType
    offset += 4 + 4 + chunkLength + 4
  }

  return hasACTL && hasIDAT && hasFDAT
}
