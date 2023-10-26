import axios from "axios";
const instance = axios.create(
    {
        baseURL: 'https://us-central1-react-ff86f.cloudfunctions.net/api'
    }
);

export default instance;
//http://127.0.0.1:5001/react-ff86f/us-central1/api
//https://us-central1-react-ff86f.cloudfunctions.net/api