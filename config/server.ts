import devConfig from "./dev";
import prodConfig from "./prod";
import stagConfig from "./stag";

const { REACT_APP_ENV } = process.env;

const ENV = REACT_APP_ENV || 'dev'

console.log("hieplq", ENV)
export const server = (ENV === 'dev' ? devConfig : (ENV === 'staging' ? stagConfig : prodConfig))
