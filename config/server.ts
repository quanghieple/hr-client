import devConfig from "./dev";
import prodConfig from "./prod";
import stagConfig from "./stag";

export const server = (REACT_APP_ENV === 'dev' ? devConfig : (REACT_APP_ENV === 'staging' ? stagConfig : prodConfig))
