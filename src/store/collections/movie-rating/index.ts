import { model, Model } from 'mongoose';

import movieRatingSchema from './schema';
import { IMovieRating, IDBMovieRating } from './model';


export class DBMovieRating implements IDBMovieRating {
  public model: Model<IMovieRating>;

	constructor() {
    this.model = model<IMovieRating>('Movie_rating', movieRatingSchema);
	}
}
