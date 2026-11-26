export function getDevicePixelRatio(): number {
    return (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
}

export function snapToDevicePixel(value: number): number {
    const dpr = getDevicePixelRatio();
    return Math.round(value * dpr) / dpr;
}

export function snapLineThicknessToDevicePixel(thickness: number): number {
    const dpr = getDevicePixelRatio();
    return Math.max(1, Math.round(thickness * dpr)) / dpr;
}
