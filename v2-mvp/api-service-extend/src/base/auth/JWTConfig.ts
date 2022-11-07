
let JWTConfig = {
  secret: process.env.JWT_SECRET || 'f47547372b2274db2572c77697f4aff6dbd4ce46961c4e7fb90f2bd90ea13ef3',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'

}
export default JWTConfig;