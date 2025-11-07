import * as cheerio from 'cheerio'

interface DollarEntity {
  entity: string
  imageUrl: string | undefined
  imageAlt: string
  buyPrice: string
  sellPrice: string
  spread: string
  date: string | undefined
}

interface AverageData {
  buyPrice: string
  sellPrice: string
  spread: string
}

interface ScraperResponse {
  success: boolean
  average?: AverageData
  entities?: DollarEntity[]
  error?: string
}

export default defineEventHandler(async (event): Promise<ScraperResponse> => {
  try {
    const baseUrl = 'https://www.infodolar.com.do'

    // Fetch the HTML page
    const response = await fetch(baseUrl)
    const html = await response.text()

    // Load HTML into cheerio
    const $ = cheerio.load(html)

    // Extract data from the table
    const dollarData: DollarEntity[] = []

    // Find all rows in the main dollar table
    $('#Dolar tbody tr').each((index, element) => {
      const row = $(element)

      // Extract image
      const imgElement = row.find('.colNombre img')
      let imageUrl = imgElement.attr('src')

      // Convert relative URLs to absolute URLs
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = baseUrl + imageUrl
      }

      const entity = row.find('.colNombre .nombre').text().trim()
      const buyPrice = row.find('.colCompraVenta').eq(0).text().trim().split('\n')[0]
      const sellPrice = row.find('.colCompraVenta').eq(1).text().trim().split('\n')[0]
      const spread = row.find('.colSpread').text().trim()
      const date = row.find('.timeago').attr('title')

      dollarData.push({
        entity,
        imageUrl,
        imageAlt: imgElement.attr('alt') || entity,
        buyPrice,
        sellPrice,
        spread,
        date
      })
    })

    // Extract the average (Promedio InfoDolar)
    const average: AverageData = {
      buyPrice: $('#DolarPromedio .colCompraVenta').eq(0).text().trim().split('\n')[0],
      sellPrice: $('#DolarPromedio .colCompraVenta').eq(1).text().trim().split('\n')[0],
      spread: $('#DolarPromedio .colSpread').text().trim()
    }

    return {
      success: true,
      average,
      entities: dollarData
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
});
