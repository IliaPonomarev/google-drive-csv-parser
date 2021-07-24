import { Model } from 'mongoose';

export interface IMovieInfo {
  movie_id: number;
  original_title: string;
}

export interface IDBMovieInfo {
  model: Model<IMovieInfo>;

  add(instance: IMovieInfo);
}