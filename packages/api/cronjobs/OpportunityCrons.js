import cron from 'node-cron'
import fetch from 'node-fetch'
import MeiliSearchClient from '../db/MeiliSearch.js'

const initScheduledJobs = async () => {
  // Schedule a cron job to run every 30 minutes
  const updateUnstoppedOpportunities = cron.schedule(
    '*/1925 * * * *',
    async () => {
      try {
        const newData = []
        await MeiliSearchClient.index('unstop').deleteAllDocuments()
        try {
          for (let i = 1; i <= 50; i++) {
            console.log(`Fetching page ${i}`)
            const response = await fetch(
              `https://unstop.com/api/public/opportunity/search-new?page=${i}&per_page=15&oppstatus=open`
            )
            const data = await response.json()
            const opportunities = data.data.data
            console.log(`Fetched ${opportunities.length} opportunities`)

            newData.push(
              ...opportunities.map(opportunity => ({
                ...opportunity,
                end_date_filter: Date.parse(opportunity?.end_date)
              }))
            )
          }
        } catch (error) {
          console.log(error)
        }
        console.log(`Adding ${newData.length} opportunities to MeiliSearch`)

        await MeiliSearchClient.index('unstop').addDocuments(newData)
        await MeiliSearchClient.index('unstop').updateFilterableAttributes([
          'end_date_filter',
          'type'
        ])
      } catch (error) {
        console.log(error)
      }
    }
  )
  updateUnstoppedOpportunities.start()
}

export default initScheduledJobs
