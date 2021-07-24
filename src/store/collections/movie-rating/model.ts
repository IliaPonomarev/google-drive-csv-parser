import { Model } from 'mongoose';

export interface IMovieRating {
  movie_id: number;
  rating: number;
}

export interface IDBMovieRating {
  model: Model<IMovieRating>;

  add(instance: IMovieRating);
}