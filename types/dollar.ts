export interface DollarEntity {
    entity: string
    imageUrl: string | undefined
    imageAlt: string
    buyPrice: string
    sellPrice: string
    spread: string
    date: string | undefined
}

export interface AverageData {
    buyPrice: string
    sellPrice: string
    spread: string
}

export interface ScraperResponse {
    success: boolean
    average?: AverageData
    entities?: DollarEntity[]
    error?: string
}
