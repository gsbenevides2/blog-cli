declare module 'webp-converter' {
  export function cwebp(
    input: string,
    output: string,
    quality: string
  ): Promise<void>
}
