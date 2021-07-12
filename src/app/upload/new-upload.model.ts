export class NewUpload {
  constructor(
    public title: string,
    public description: string,
    public url: string,
    public owner_id: number,
    public image: File
  ) {}
}