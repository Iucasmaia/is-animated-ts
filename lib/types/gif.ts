/**
 * Returns total length of data blocks sequence
 *
 * @param buffer - The buffer to read from
 * @param offset - The starting offset in the buffer
 * @returns The total length of the data blocks
 */
function getDataBlocksLength(buffer: Buffer, offset: number): number {
  let length = 0

  while (offset + length < buffer.length && buffer[offset + length]!) {
    length += buffer[offset + length]! + 1
  }

  return length + 1
}

/**
 * Checks if buffer contains GIF image
 *
 * @param buffer - The buffer to check
 * @returns True if the buffer contains a GIF image, false otherwise
 */
export function isGIF(buffer: Buffer): boolean {
  const header = buffer.slice(0, 3).toString('ascii')
  return header === 'GIF'
}

/**
 * Checks if buffer contains animated GIF image
 *
 * @param buffer - The buffer to check
 * @returns True if the buffer contains an animated GIF, false otherwise
 */
export function isAnimated(buffer: Buffer): boolean {
  let hasColorTable: boolean
  let colorTableSize: number
  let header: string
  let offset = 0
  let imagesCount = 0

  // Check if this is this image has valid GIF header.
  // If not return false. Chrome, FF and IE doesn't handle GIFs with invalid version.
  if (buffer.length < 3) {
    return false
  }
  header = buffer.slice(0, 3).toString('ascii')

  if (header !== 'GIF') {
    return false
  }

  // Skip header, logical screen descriptor and global color table
  if (buffer.length < 11) {
    return false
  }

  hasColorTable = (buffer[10]! & 0x80) !== 0 // 0b10000000
  colorTableSize = buffer[10]! & 0x07 // 0b00000111

  offset += 6 // skip header
  offset += 7 // skip logical screen descriptor
  offset += hasColorTable ? 3 * Math.pow(2, colorTableSize + 1) : 0 // skip global color table

  // Find if there is more than one image descriptor

  while (imagesCount < 2 && offset < buffer.length) {
    const currentByte = buffer[offset]
    if (currentByte === 0x2C) {
      // Image descriptor block. According to specification there could be any
      // number of these blocks (even zero). When there is more than one image
      // descriptor browsers will display animation (they shouldn't when there
      // is no delays defined, but they do it anyway).
      imagesCount += 1

      if (offset + 9 >= buffer.length) {
        return false
      }

      const imageDescriptorByte = buffer[offset + 9]!
      hasColorTable = (imageDescriptorByte & 0x80) !== 0 // 0b10000000
      colorTableSize = imageDescriptorByte & 0x07 // 0b00000111

      offset += 10 // skip image descriptor
      offset += hasColorTable ? 3 * Math.pow(2, colorTableSize + 1) : 0 // skip local color table
      offset += getDataBlocksLength(buffer, offset + 1) + 1 // skip image data
    } else if (currentByte === 0x21) {
      // Skip all extension blocks. In theory this "plain text extension" blocks
      // could be frames of animation, but no browser renders them.
      offset += 2 // skip introducer and label
      offset += getDataBlocksLength(buffer, offset) // skip this block and following data blocks
    } else if (currentByte === 0x3B) {
      // Stop processing on trailer block,
      // all data after this point will is ignored by decoders
      offset = buffer.length // fast forward to end of buffer
    } else {
      // Oops! This GIF seems to be invalid
      offset = buffer.length // fast forward to end of buffer
    }
  }

  return imagesCount > 1
}
