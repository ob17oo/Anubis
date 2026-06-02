export class RateLimiter {
    private timestamps: Map<string, number[]> = new Map()
    private windowMs: number
    private maxRequests: number

    constructor(windowMs: number, maxRequests: number) {
        this.windowMs = windowMs
        this.maxRequests = maxRequests
    }

    check(key: string): boolean {
        const now = Date.now()
        const userTimestamps = this.timestamps.get(key) || []
        
        // Remove old timestamps
        const validTimestamps = userTimestamps.filter(t => now - t < this.windowMs)
        
        if (validTimestamps.length >= this.maxRequests) {
            return false // Rate limit exceeded
        }
        
        validTimestamps.push(now)
        this.timestamps.set(key, validTimestamps)
        return true
    }
}

// Global instances for Server Actions
export const purchaseRateLimiter = new RateLimiter(60000, 5) // 5 requests per minute
export const reviewRateLimiter = new RateLimiter(60000, 3) // 3 reviews per minute
