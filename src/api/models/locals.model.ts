export type Locals = {
  user: {id: string, username: string},
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  }
}