import axios from "axios";

const API_URL = "http://localhost:8080/api/contests";

export const getContests = (year, month) => {

    return axios.get(API_URL, {
        params: {
            year: year,
            month: month
        }
    });

};