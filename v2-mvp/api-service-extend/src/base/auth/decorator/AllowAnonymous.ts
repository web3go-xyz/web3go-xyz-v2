import { SetMetadata } from '@nestjs/common';

export const ALL_ANONYMOUS_KEY = 'allowAnonymous';
export const AllowAnonymous = () => SetMetadata(ALL_ANONYMOUS_KEY, true);