import { Model } from 'mongoose';

export interface IMovieRating {
  movie_id: string;
  rating: string;
}

export interface IDBMovieRating {
  model: Model<IMovieRating>;
}