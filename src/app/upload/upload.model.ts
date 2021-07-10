export class Upload {
  constructor(
    public id: number | null,
    public title: string,
    public description: string,
    public url: string,
    public owner: string
  ) {}
}