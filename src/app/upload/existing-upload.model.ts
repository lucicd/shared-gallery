export class ExistingUpload {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public url: string,
    public owner: string,
    public owner_id: number,
    public owner_email: string
  ) {}
}