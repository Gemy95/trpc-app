import { Injectable, NestMiddleware } from '@nestjs/common';
import { ROLE_TO_QUERY } from './category.constants';
import * as _ from 'lodash';

@Injectable()
export class CategoryRoleToQueryMiddleware implements NestMiddleware {
  use(req, res, next) {
    const account = req.account;
    const defaultQuery = ROLE_TO_QUERY[account?.role] || ROLE_TO_QUERY['*'] || {};
    const query = req.query;
    req.query = _.merge(query, defaultQuery);
    next();
  }
}
