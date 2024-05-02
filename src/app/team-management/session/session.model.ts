export class Session {
  constructor(
    public _id?: string,
    public date?: Date,
    public time?: string,
    public location?: string,
    public topics?: string[]
  ) {}
}
