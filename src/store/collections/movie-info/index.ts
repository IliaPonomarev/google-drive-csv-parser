import { model, Model } from 'mongoose';

import movieInfoSchema from './schema';
import { IMovieInfo, IDBMovieInfo } from './model';


export class DBMovieInfo implements IDBMovieInfo {
  public model: Model<IMovieInfo>;

	constructor() {
    this.model = model<IMovieInfo>('Movie', movieInfoSchema);
	}

  public add(instance: IMovieInfo) {
    return this.model.create(instance);
  }
}
