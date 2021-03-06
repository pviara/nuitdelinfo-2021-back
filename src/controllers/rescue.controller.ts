import { AppError } from '../model/error.model';
import { CreateRescuePayload, UpdateRescuePayload } from '../model/DTO/rescue/create-rescue.payload';
import { Helper } from '../helper.utils';
import { isValidObjectId } from 'mongoose';
import {
  NextFunction,
  Response
} from 'express';
import { RescueRepository } from '../repos/rescue.repository';
import { SignedRequest } from '../model/signed-request.model';

export class RescueController {
  constructor(private _repo: RescueRepository) {}
  
  async confirm(req: SignedRequest, res: Response, next: NextFunction) {
    if (!req.params
      || Helper.isObjectEmpty(req.params)
      || !req.params.rescueId) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
      }

    if (!isValidObjectId(req.params.rescueId)) {
      throw new AppError(400, 'Invalid object id.');
    }

    return await this._repo.confirm(
      req.params.rescueId as string,
      req.author._id
    );
  }
  
  async create(req: SignedRequest, res: Response, next: NextFunction) {
    if (!req.body
      || Helper.isObjectEmpty(req.body)
      || !req.body.author
      || !req.body.rescueDate
      || !req.body.location
      || req.body.location.coordinates.length < 2
      || Helper.isObjectEmpty(req.body.author)
      || !req.body.rescuers
      || req.body.rescuers.length === 0) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
      }

      return await this._repo.create(
        <CreateRescuePayload>req.body,
        req.author._id
      );
  }

  async delete(req: SignedRequest, res: Response, next: NextFunction) {
    if (!req.params
      || Helper.isObjectEmpty(req.params)
      || !req.params.rescueId) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
      }

    if (!isValidObjectId(req.params.rescueId)) {
      throw new AppError(400, 'Invalid object id.');
    }

    return await this._repo.delete(req.params.rescueId as string);
  }

  async findAll(req: SignedRequest, res: Response, next: NextFunction) {
    return await this._repo.findAll();
  }
  
  async update(req: SignedRequest, res: Response, next: NextFunction) {
    if (!req.body
      || Helper.isObjectEmpty(req.body)
      || !req.params.rescueId) {
        throw new AppError(400, 'Missing entire body or one or a few mandatory fields.');
      }

      if (!isValidObjectId(req.params.rescueId)) {
        throw new AppError(400, 'Invalid object id.');
      }

      return await this._repo.update(
        req.params.rescueId,
        <UpdateRescuePayload>req.body,
        req.author._id
      );
  }
}