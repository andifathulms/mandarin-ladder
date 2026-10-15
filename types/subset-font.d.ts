declare module 'subset-font' {
  type Options = { targetFormat?: 'sfnt' | 'woff' | 'woff2' | 'truetype'; preserveNameIds?: number[]; variationAxes?: Record<string, number | { min: number; max: number; default?: number }> };
  export default function subsetFont(font: Buffer, text: string, options?: Options): Promise<Buffer>;
}
