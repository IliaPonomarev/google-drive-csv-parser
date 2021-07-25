import { Model } from 'mongoose';

export interface IMovieInfo {
  movie_id: number;
  original_title: string;
}

export interface IMovieInfoModel extends Model<IMovieInfo> {}

export interface IDBMovieInfo {
  model: any;

  add(instance: IMovieInfo);
  findWithHighestRating(limit?);
}