import { Message } from "@angular/compiler/src/i18n/i18n_ast";

export class ServerResponse<DataType> {
  constructor(
    public message: string,
    public data: DataType
  ) {}
}