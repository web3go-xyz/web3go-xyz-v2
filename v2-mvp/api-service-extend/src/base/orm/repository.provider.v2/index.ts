import { Connection } from 'typeorm';
import { RepositoryConsts } from '../repositoryConsts';

let repositoryProviders_platform = [];

for (const key in RepositoryConsts.REPOSITORYS_PLATFORM) {
  if (Object.prototype.hasOwnProperty.call(RepositoryConsts.REPOSITORYS_PLATFORM, key)) {
    const repository = RepositoryConsts.REPOSITORYS_PLATFORM[key];
    repositoryProviders_platform.push({
      provide: repository.provide,
      useFactory: (connection: Connection) => {
        return connection.getRepository(repository.entityTarget);
      },
      inject: [repository.connection]
    });
  }
}
console.log(`repositoryProviders_platform:`);
console.log(repositoryProviders_platform);


export default repositoryProviders_platform;
