export class AccountSearchResult {
  accountId: string;
  type: 'email' | 'wallet';
  binding: string;
  verified: boolean;
  ext: any;
}
