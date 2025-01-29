const axios = require("axios");
const constants = require("../config/constants");

class CollegeService {
  static async fetchColleges(page = 0, perPage = 20) {
    try {
      const response = await axios.get(
        constants.EXTERNAL_APIS.COLLEGE_SCORECARD.BASE_URL,
        {
          params: {
            api_key: constants.EXTERNAL_APIS.COLLEGE_SCORECARD.API_KEY,
            "school.degrees_awarded.predominant": "3,4",
            "school.ownership": "1,2",
            fields:
              "id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall",
            page,
            per_page: perPage,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch colleges: " + error.message);
    }
  }
}

module.exports = CollegeService;
