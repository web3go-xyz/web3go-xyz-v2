import { Connection } from 'typeorm';
import { RepositoryConsts } from '../repositoryConsts';

let repositoryProviders_metabase = [];

for (const key in RepositoryConsts.REPOSITORYS_METABASE) {
  if (Object.prototype.hasOwnProperty.call(RepositoryConsts.REPOSITORYS_METABASE, key)) {
    const repository = RepositoryConsts.REPOSITORYS_METABASE[key];
    repositoryProviders_metabase.push({
      provide: repository.provide,
      useFactory: (connection: Connection) => {
        return connection.getRepository(repository.entityTarget);
      },
      inject: [repository.connection]
    });
  }
}
console.log(`repositoryProviders_metabase:`);
console.log(repositoryProviders_metabase);


export default repositoryProviders_metabase;
