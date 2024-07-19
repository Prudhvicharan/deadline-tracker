const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeCollegeDeadlines(collegeUrl) {
  try {
    const response = await axios.get(collegeUrl);
    const $ = cheerio.load(response.data);
    
    const deadlines = [];
    // Adjust selectors based on the college website's structure
    $('.program-deadline').each((i, elem) => {
      deadlines.push({
        program: $(elem).find('.program-name').text().trim(),
        deadline: $(elem).find('.deadline-date').text().trim(),
      });
    });

    return deadlines;
  } catch (error) {
    console.error(`Error scraping ${collegeUrl}:`, error);
    return [];
  }
}

module.exports = { scrapeCollegeDeadlines };
