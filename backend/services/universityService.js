const axios = require('axios');
const NodeCache = require('node-cache');

const API_KEY = '3wAuDRWXKx4TDcS1QLoKAjEkUo6csct8ZPF4xNZX'; // Replace with your actual API key
const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools';
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

class UniversityService {
  async getUniversities(page = 0, perPage = 20) {
    const cacheKey = `universities_${page}_${perPage}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          api_key: API_KEY,
          'school.degrees_awarded.predominant': '3,4', // 3 for Bachelor's, 4 for Graduate
          'school.ownership': '1,2', // 1 for public, 2 for private non-profit
          fields: 'id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall',
          page: page,
          per_page: perPage,
        },
      });

      const universities = response.data.results.map(uni => ({
        id: uni.id,
        name: uni['school.name'],
        city: uni['school.city'],
        state: uni['school.state'],
        zip: uni['school.zip'],
        admissionRate: uni['latest.admissions.admission_rate.overall'],
      }));

      cache.set(cacheKey, universities);
      return universities;
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  }

  async getUniversityById(id) {
    const cacheKey = `university_${id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }

    try {
      console.log(`Fetching university with ID: ${id}`); // Add logging
      const response = await axios.get(`${BASE_URL}/schools/${id}`, { // Corrected URL structure
        params: {
          api_key: API_KEY,
          fields: 'id,school.name,school.city,school.state,school.zip,latest.admissions.admission_rate.overall,latest.programs.cip_4_digit',
        },
      });

      console.log('API response:', response.data); // Add logging

      if (response.data.results.length === 0) {
        throw new Error('No university found with the given ID');
      }

      const uni = response.data.results[0];
      const university = {
        id: uni.id,
        name: uni['school.name'],
        city: uni['school.city'],
        state: uni['school.state'],
        zip: uni['school.zip'],
        admissionRate: uni['latest.admissions.admission_rate.overall'],
        programs: uni['latest.programs.cip_4_digit'].map(program => ({
          name: program.title,
          code: program.code,
        })),
      };

      cache.set(cacheKey, university);
      return university;
    } catch (error) {
      console.error('Error fetching university details:', error); // Improved error logging
      throw error;
    }
  }
}

module.exports = new UniversityService();