interface IConfig {
  db: string;
  domain: string;
  httpProtocol: string;
}


const Config: IConfig = {
  db: 'mongodb://localhost:27017/car',
  domain: 'localhost',
  httpProtocol: 'http',
};

export {
  IConfig,
  Config
};
