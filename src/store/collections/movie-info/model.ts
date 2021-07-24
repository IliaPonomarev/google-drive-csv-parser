import { Model } from 'mongoose';

export interface IMovieInfo {
  movie_id: string;
  original_title: string;
}

export interface IDBMovieInfo {
  model: Model<IMovieInfo>;
}